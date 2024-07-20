import Header from "@/components/shared/Header"

const RootPage = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 py-5 md:py-10">
        {children}
      </div>
    </main>
  )
}

export default RootPage
