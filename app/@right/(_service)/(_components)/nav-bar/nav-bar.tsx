// @/app/@right/(_service)/(_components)/nav-bar/nav-bar.tsx

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import StaticNavBar from "./public-flow/static-nav-bar";
import EditableNavBar from "./admin-flow/editable-nav-bar";
// check
export async function NavBar() {
  const session = await auth();
  console.log("NavBar session ", session)
  const user = session?.user;
  const isPrivilegedUser =
    user?.type && ["architect", "editor", "admin"].includes(user.type);

  if (isPrivilegedUser) {
    return <div className="relative"> <EditableNavBar /></div>;
  }
  return <StaticNavBar />;
}
