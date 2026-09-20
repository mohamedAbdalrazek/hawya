import {
    isAllowedMapsHost,
    mapsSearchQueryFromUrl,
    parseMapsCoordinates,
    parseMapsSearchPayload,
} from "./mapsLink";

describe("isAllowedMapsHost", () => {
    it("allows the Google Maps share and maps hosts", () => {
        expect(isAllowedMapsHost("maps.app.goo.gl")).toBe(true);
        expect(isAllowedMapsHost("goo.gl")).toBe(true);
        expect(isAllowedMapsHost("google.com")).toBe(true);
        expect(isAllowedMapsHost("maps.google.com")).toBe(true);
        expect(isAllowedMapsHost("www.google.com")).toBe(true);
    });

    it("rejects hosts outside the allowlist", () => {
        expect(isAllowedMapsHost("evil.com")).toBe(false);
        expect(isAllowedMapsHost("google.com.evil.com")).toBe(false);
        expect(isAllowedMapsHost("goo.gl.attacker.com")).toBe(false);
        expect(isAllowedMapsHost("127.0.0.1")).toBe(false);
        expect(isAllowedMapsHost("localhost")).toBe(false);
    });
});

describe("parseMapsCoordinates", () => {
    it("reads a place pin from !3dLAT!4dLNG", () => {
        expect(
            parseMapsCoordinates(
                "https://www.google.com/maps/place/Marakeb/@26.4,50.0,17z/data=!3m1!4b1!8m2!3d26.443338!4d50.118291"
            )
        ).toEqual({ lat: 26.443338, lng: 50.118291 });
    });

    it("prefers the place pin over the viewport @lat,lng", () => {
        expect(
            parseMapsCoordinates(
                "https://maps.google.com/maps/@26.1,50.2,14z/data=!3d26.443338!4d50.118291"
            )
        ).toEqual({ lat: 26.443338, lng: 50.118291 });
    });

    it("reads /@lat,lng when no place pin is present", () => {
        expect(
            parseMapsCoordinates(
                "https://www.google.com/maps/@26.443338,50.118291,14z"
            )
        ).toEqual({ lat: 26.443338, lng: 50.118291 });
    });

    it("reads q=lat,lng", () => {
        expect(
            parseMapsCoordinates(
                "https://maps.google.com/maps?q=26.443338,50.118291"
            )
        ).toEqual({ lat: 26.443338, lng: 50.118291 });
    });

    it("returns null when the URL has no coordinates", () => {
        expect(
            parseMapsCoordinates("https://maps.app.goo.gl/abc123")
        ).toBeNull();
    });

    it("returns null for an invalid URL", () => {
        expect(parseMapsCoordinates("not a url")).toBeNull();
    });

    it("returns null for out-of-range coordinates", () => {
        expect(
            parseMapsCoordinates("https://maps.google.com/maps?q=91,0")
        ).toBeNull();
        expect(
            parseMapsCoordinates("https://maps.google.com/maps?q=0,181")
        ).toBeNull();
    });
});

describe("mapsSearchQueryFromUrl", () => {
    it("reads the place title from a WhatsApp share redirect", () => {
        expect(
            mapsSearchQueryFromUrl(
                "https://www.google.com/maps/place/C37H%2BQ2X+%D9%85%D8%B1%D8%A7%D9%83%D8%A8+Car+Rental,+Al+Rawdah,+Dammam+32257/data=!4m2!3m1!1s0x3e49fdbc3371da3f:0x6a88b52797a618bc"
            )
        ).toContain("C37H+Q2X");
    });

    it("reads q= when there is no place path", () => {
        expect(
            mapsSearchQueryFromUrl(
                "https://www.google.com/maps?q=C37H%2BQ2X%20Dammam"
            )
        ).toBe("C37H+Q2X Dammam");
    });
});

describe("parseMapsSearchPayload", () => {
    it("reads the first [null,null,lat,lng] place pin", () => {
        expect(
            parseMapsSearchPayload(
                `)]}' [["place",[[114334,49.95,26.42]]], [null,null,26.420682799999998,50.088794299999996],"Dammam"]`
            )
        ).toEqual({ lat: 26.420682799999998, lng: 50.088794299999996 });
    });

    it("returns null when the payload has no pin", () => {
        expect(parseMapsSearchPayload(`)]}' [["no coords"]]`)).toBeNull();
    });
});
