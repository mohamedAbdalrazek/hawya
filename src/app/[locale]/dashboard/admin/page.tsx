// app/some-path/page.tsx (server component)
import { redirect } from "next/navigation";

export default function Page() {
    redirect("/dashboard/admin/staff");
}
