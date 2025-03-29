import LoadingPageProgress from "@/components/loading-page-progress"



export default function LoadingPage() {
 

  return (
    <div className="min-h-[calc(100vh-80px)]  dark:bg-dark-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
  
        {/* Loading Progress */}
        
        <LoadingPageProgress/>

      </div>
    </div>
  )
}

