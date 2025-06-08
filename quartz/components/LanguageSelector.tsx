import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/language.inline"
import style from "./styles/languageSelector.scss"

const LanguageSelector: QuartzComponent = ({ }: QuartzComponentProps) => {
  return (
    <select id="language-select" class="language-select">
      <option value="ko">한국어</option>
      <option value="ja">日本語</option>
      <option value="en">English</option>
    </select>
  )
}

LanguageSelector.afterDOMLoaded = script
LanguageSelector.css = style

export default (() => LanguageSelector) satisfies QuartzComponentConstructor
