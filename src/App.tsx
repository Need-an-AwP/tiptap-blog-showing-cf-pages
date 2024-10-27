import { useState, useRef, useEffect } from 'react'
import './App.css'
import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import 'cal-sans'

import { HeroHighlight, Highlight } from "@/components/ui/background-hero-highlight";
import { EditorContent } from '@tiptap/react'
import { useBlockEditor } from './useBlockEditor'
import { EditorHeader } from './components/BlockEditor/EditorHeader'
import { ArticleCard } from './components/articleCard'
import { useParams } from 'react-router-dom';
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconBrandX, IconBrandGithub, IconBrandWechat } from '@tabler/icons-react';
import { Sidebar } from '@/components/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'


const homeURL = "https://klz-personalsite-cf-vite-react-ts.pages.dev"
const workerAPI = "https://wokerd1-blue-math-ewq.1790414525klz.workers.dev"
const showingPageURL = "https://tiptap-blog-showing.pages.dev"

// readonly tiptap editor
function App() {
    const { articleId } = useParams();
    const { editor } = useBlockEditor()
    const [allArticles, setAllArticles] = useState<any[]>([])
    const headerRef = useRef<HTMLDivElement>(null)
    const [footerArticlesId, setFooterArticlesId] = useState<number[]>([])
    const [hovered, setHovered] = useState<number | null>(null);
    const leftSidebar = useSidebar()

    if (!editor) {
        return null
    }

    function formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day}-${hours}:${minutes}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${workerAPI}/api/all_doc`);
            const data = await res.json();
            setAllArticles(data)
            console.log(data)
            let filteredArticles = data
            if (articleId) {
                filteredArticles = data.filter((article: any) => article.id !== Number(articleId));
            }
            if (filteredArticles.length > 3) {
                const shuffled = [...filteredArticles].sort(() => 0.5 - Math.random());
                const selectedIds = shuffled.slice(0, 3).map(article => article.id);
                setFooterArticlesId(selectedIds);
            } else {
                setFooterArticlesId(filteredArticles.map((article: any) => article.id));
            }
        };
        fetchData();
    }, [])

    const links = [
        {
            title: "back to home page",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: homeURL,
        },
        {
            title: "github",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://github.com/Need-an-AwP",
        },
        {
            title: "X",
            icon: (
                <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://x.com/FPS_deformity",
        },
        {
            title: "weChat",
            icon: (
                <IconBrandWechat className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://wokerd1-blue-math-ewq.1790414525klz.workers.dev/api/image?id=14",
        },
    ]

    return (
        <>
            <HeroHighlight />
            <div className="flex flex-col relative z-10 min-h-screen w-screen">
                <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
                <header ref={headerRef} className=" sticky top-0 left-0 right-0 z-20 border-b border-neutral-200 border-opacity-50 py-2">
                    <EditorHeader
                        editor={editor}
                        allArticles={allArticles}
                        articleId={articleId}
                        homeURL={homeURL}
                        isSidebarOpen={leftSidebar.isOpen}
                        toggleSidebar={leftSidebar.toggle}
                    />
                </header>
                <div className={`flex-1 max-h-[calc(100vh-50px)] w-[calc(100vw-5px)] justify-center overflow-y-auto overflow-x-hidden doc-scrollbar`}>
                    <div className='flex flex-col mb-[30vh] w-full mx-auto'>
                        <EditorContent editor={editor} className="flex-1 min-h-[calc(100vh-500px)]" />
                    </div>
                    <footer className="w-full py-4 bg-neutral-600 bg-opacity-10 backdrop-blur-sm text-center flex flex-col items-center">
                        <div className='flex flex-row gap-4 mx-8 my-4'>
                            {footerArticlesId.map((id, index) => {
                                const article = allArticles.find((article) => article.id === id);
                                return (
                                    <ArticleCard
                                        key={index}
                                        index={index}
                                        hovered={hovered}
                                        setHovered={setHovered}
                                        className="h-[150px]  sm:max-w-[calc(50vw-3rem)] lg:max-w-[calc(33.33vw-3rem)] xl:max-w-[calc(25vw-3rem)] flex flex-col justify-center items-center cursor-pointer"
                                        onClick={() => {
                                            // console.log('navigate to', article.id)
                                            window.location.href = `/${article.id}`
                                        }}
                                    >
                                        <p className="text-md font-bold relative z-20 mt-2 text-white">
                                            {article.title}
                                        </p>
                                        <div className="text-neutral-200 text-sm mt-4 relative z-20">
                                            {formatTimestamp(article.update_time)}
                                        </div>
                                    </ArticleCard>
                                )
                            })}
                        </div>

                        <div className='mt-16 grid grid-cols-2 justify-between w-full'>
                            <div className='  relative z-20 mt-auto text-xs font-light text-neutral-500 justify-center'>
                                <p>
                                    Deployed on Cloudflare <br />
                                </p>
                            </div>
                            <div className='flex flex-row justify-end pr-8'>
                                <div>
                                    <FloatingDock items={links} />
                                </div>
                            </div>
                        </div>
                    </footer>

                </div>
            </div>
        </>

    )
}

export default App
