export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="px-8 md:flex md:justify-start md:px-6">
            <main>
                {children}
            </main>
        </div>
    )
}