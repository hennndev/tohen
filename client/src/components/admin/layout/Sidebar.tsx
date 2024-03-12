import { sidebarIcons } from '@/utils/utils'
import { useNavigate } from 'react-router-dom'
import { Shell, LucideIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const Sidebar = () => {
    const navigate = useNavigate()
    const handleNavigate = (link: string) => {
        navigate(link)
    }
    return (
        <aside className='sticky top-0 flex flex-col h-screen w-[280px] pt-5 overflow-y-auto scrollbar-hide'>
            <h1 className='flex-center text-2xl font-bold text-[#222] dark:text-gray-300'>
                <Shell className='mr-2'/>
                TOHEN.
            </h1>
            <div className='mt-10 px-6 pb-5 text-[#222] dark:text-gray-300 space-y-5 flex-1'>
                {sidebarIcons.map(({Icon, name, link, subLinks}: {Icon: LucideIcon, name: string, link?: string, subLinks?: any}) => {     
                    return !subLinks ? (
                        <div key={name} onClick={() => handleNavigate(link as string)} className="flexx hover:bg-primary-foreground dark:hover:bg-primary-foreground rounded-lg py-2 pl-7 pr-5 cursor-pointer font-medium">
                            <Icon className='mr-3' size={22}/>
                            <p className='text-base'>{name}</p>
                        </div>
                    ) : (
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" className='border-none'>
                                <AccordionTrigger className='rounded-lg hover:bg-primary-foreground dark:hover:bg-primary-foreground py-2 pl-7 pr-5'>
                                    <div key={name} className="flexx cursor-pointer">
                                        <Icon className='mr-3' size={22}/>
                                        <p className='text-base'>{name}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className='flex flex-col ml-5 !py-0 space-y-3'>
                                    {subLinks.map(({Icon, name, link}: {Icon: LucideIcon, name: string, link: string}) => (
                                        <div key={name} className="font-medium mt-3 flexx hover:bg-primary-foreground dark:hover:bg-primary-foreground rounded-lg py-2 pl-10 pr-5 cursor-pointer" onClick={() => handleNavigate(link)}>
                                            <Icon className='mr-3' size={22}/>
                                            <p className='text-base'>{name}</p>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )
                })}
            </div>
        </aside>
    )
}

export default Sidebar