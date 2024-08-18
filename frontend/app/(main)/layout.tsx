import NavMenu from "./ui/NavMenu";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavMenu />
            <main>{children}</main>
        </>
    )
}