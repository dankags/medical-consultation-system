import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export const metadata: Metadata = {
  title:"Home",
  description: 'Heatlth care consultation system',
};

export default function Home() {
  return (
    <div className="w-full h-screen min-h-screen flex ">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image src="/assets/icons/logo-full.svg" alt="patient" width={1000} height={1000} className="h-10 w-fit mb-12" />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      
      </section>
      <Image
      src="/assets/images/onboarding-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[50%]"
    />
    </div>
  );
}
