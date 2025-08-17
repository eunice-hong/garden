import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/comments.inline"

type Options = {
  provider: "commentbox"
  options: {
    projectId: string
    className?: string
    defaultBoxId?: string
    tlcParam?: string
    sortOrder?: "best" | "newest" | "oldest"
    backgroundColor?: string
    textColor?: string
    subtextColor?: string
    singleSignOn?: {
      buttonText?: string
      buttonIcon?: string
      buttonColor?: string
      autoSignOn?: boolean
      onSignOn?: (onComplete: (token: string) => void, onError: (error: Error) => void) => void
      onSignOut?: () => void
    }
    createBoxUrl?: (boxId: string, pageLocation: Location) => string
    onCommentCount?: (count: number) => void
  }
}

export default ((opts: Options) => {
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    // check if comments should be displayed according to frontmatter
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    return (
      <div
        class={classNames(displayClass, opts.options.className || "commentbox")}
        id={opts.options.defaultBoxId || "commentbox"}
        data-project-id={opts.options.projectId}
        data-tlc-param={opts.options.tlcParam || "tlc"}
        data-sort-order={opts.options.sortOrder || "best"}
        data-background-color={opts.options.backgroundColor || ""}
        data-text-color={opts.options.textColor || ""}
        data-subtext-color={opts.options.subtextColor || ""}
      ></div>
    )
  }

  Comments.afterDOMLoaded = script

  return Comments
}) satisfies QuartzComponentConstructor<Options>
