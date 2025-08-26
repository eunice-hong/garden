import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/comments.inline"

type Options = {
  provider: "cusdis"
  options: {
    appId: string
    host?: string
    lang?: string
    className?: string
    theme?: "auto" | "light" | "dark"
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
        class={classNames(displayClass, opts.options.className || "cusdis")}
        id={"cusdis_thread"}
        data-host={opts.options.host || "https://cusdis.com"}
        data-app-id={opts.options.appId}
        data-lang={opts.options.lang || "en"}
        data-theme={opts.options.theme || "auto"}
      ></div>
    )
  }

  Comments.afterDOMLoaded = script

  return Comments
}) satisfies QuartzComponentConstructor<Options>
