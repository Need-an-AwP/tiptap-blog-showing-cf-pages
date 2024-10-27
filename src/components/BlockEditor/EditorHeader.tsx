import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { Toolbar } from '@/components/ui/Toolbar'
import { Icon } from '@/components/ui/Icon'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"


export const EditorHeader = ({ editor, allArticles, articleId, homeURL,isSidebarOpen, toggleSidebar }: {
    editor: Editor,
    allArticles: any[],
    articleId: string | undefined,
    homeURL: string,
    isSidebarOpen?: boolean,
    toggleSidebar?: () => void
}) => {

    const [currentArticle, setCurrentArticle] = useState<any>({})
    const [articleNotFound, setArticleNotFound] = useState(false)
    const [noIdOffered, setNoIdOffered] = useState(false)
    const [countDown, setCountDown] = useState(15)

    useEffect(() => {
        // const urlParams = new URLSearchParams(window.location.search)
        // const articleId = urlParams.get('id')
        if (articleId) {
            const article = allArticles.find((article) => article.id === Number(articleId))
            if (article) {
                loadArticle(article.id)
                setArticleNotFound(false)
            } else {
                setArticleNotFound(true)
            }
        } else {
            setNoIdOffered(true)
            setArticleNotFound(false)
            const timer = setInterval(() => {
                setCountDown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(timer)
                        window.location.href = homeURL
                        return 0
                    }
                    return prevCount - 1
                })
            }, 1000)

            // 清理函数
            return () => clearInterval(timer)
        }
    }, [allArticles, articleId])






    const { characters, words } = useEditorState({
        editor,
        selector: (ctx): { characters: number; words: number } => {
            const { characters, words } = ctx.editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
            return { characters: characters(), words: words() }
        },
    })

    const loadArticle = (id: Number) => {
        const data = allArticles.find(article => article.id === id)
        setCurrentArticle(data)
        console.log(data)
        const content = JSON.parse(data.content)
        editor.commands.setContent(content)

    }


    return (
        <div className='flex flex-row justify-between px-2'>
            {noIdOffered && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Alert variant="destructive" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-full">
                        <AlertCircle className="h-10 w-10" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            No id offered.<br />
                            you will be redirected to the home page <br />
                            in {countDown} seconds.
                        </AlertDescription>
                    </Alert>
                </>
            )}
            {articleNotFound && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Alert variant="destructive" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-full">
                        <AlertCircle className="h-10 w-10" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Requested article not found.
                        </AlertDescription>
                    </Alert>
                </>
            )}
            <div className='flex flex-row justify-between w-full'>
                <div className='flex flex-row items-center gap-2'>
                    <Toolbar.Button
                        tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                        active={isSidebarOpen}
                        className={isSidebarOpen ? 'bg-transparent' : ''}
                        onClick={toggleSidebar}
                    >
                        <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
                    </Toolbar.Button>

                    <Toolbar.Divider />


                </div>

                <div className='flex flex-row items-center gap-2'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Toolbar.Button
                                tooltip='current doc Info'
                            >
                                <Icon name="Info" />
                            </Toolbar.Button>
                        </PopoverTrigger>
                        <PopoverContent className="space-y-2">
                            <div className="flex flex-col gap-1 text-sm">
                                <p>id: {currentArticle.id}</p>
                                <p>title: {currentArticle.title}</p>
                                <p>create: {new Date(currentArticle.create_time * 1000).toLocaleString()}</p>
                                <p>update: {new Date(currentArticle.update_time * 1000).toLocaleString()}</p>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Toolbar.Divider />

                    <div className="text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        <div>{words} {words === 1 ? 'word' : 'words'}</div>
                        <div>{characters} {characters === 1 ? 'character' : 'characters'}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
