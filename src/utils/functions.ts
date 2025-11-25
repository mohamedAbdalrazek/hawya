export const getUriFromFile = async (file: File) => {
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
    return fileUri
}

export async function validateSession(session: string, source : "client" | "server"): Promise<string | false> {
    if (!session) return false;
    const endPoint = source === "client" ? "": "https://www.marakeb.co" 
    try {
        const res = await fetch(`${endPoint}/api/admin/validate-session`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session}`,
            },
        });

        if (!res.ok) return false;

        const data = await res.json();

        if (data.ok && data.role) {
            return data.role;
        }

        return false;
    } catch (error) {
        console.error("Session validation failed:", error);
        return false;
    }
}