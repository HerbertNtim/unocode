import Header from "@/components/shared/Header"

const RootPage = ({children}: {children: React.ReactNode}) => {
  return (
    <main>
      <Header />
      <div className="flex items-center">
        {children}
      </div>
    </main>
  )
}

export default RootPage
