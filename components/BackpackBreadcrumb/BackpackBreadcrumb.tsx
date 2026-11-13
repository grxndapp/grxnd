'use client'
import './BackpackBreadcrumb.css'
import { Backpack, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

type BackpackBreadcrumbProps = {
   links: { label: string | React.ReactNode; link: string; }[]
   startingBackpack?: boolean;
   startingHome?: boolean;
}

export default function BackpackBreadcrumb ({ links, startingBackpack, startingHome }: BackpackBreadcrumbProps) {
   const router = useRouter();

   function breadcrumbOpen (link: string) {
      router.push(link);
   }

   const breadcrumbClassname = "breadcrumb-item text-xxs accent-color";
   const breadcrumbIconSize = 16

   return (
      <div className='backpack-breadcrumb'>
         <div className="backpack-breadcrumb-container">
            {links.length == 0 && (
               <ChevronLeft size={breadcrumbIconSize+4} />
            )}
            {startingHome && (
               <div className={breadcrumbClassname} onClick={() => breadcrumbOpen("/home")}>
                  <Home size={breadcrumbIconSize} /> Home
               </div>
            )}
            {startingBackpack && (
               <div className={breadcrumbClassname} onClick={() => breadcrumbOpen("/backpack")}>
                  <Backpack size={breadcrumbIconSize} /> Backpack
               </div>
            )}
            {links.length > 0 && (
               <ChevronRight size={breadcrumbIconSize} />
            )}
            {links.map((fullLink, index) => (
               <EmptyEl key={fullLink.link}>
                  <div className={breadcrumbClassname} onClick={() => breadcrumbOpen(fullLink.link)}>
                     {fullLink.label}
                  </div>
                  {links.length-1 !== index && ( <ChevronRight size={breadcrumbIconSize} /> )}
               </EmptyEl>
            ))}
         </div>
      </div>
   )
}

function EmptyEl ({ children }: { children: React.ReactNode }) {
   return <>{children}</>
}
