import { FontWeight, SatoriOptions } from "satori/wasm"
import { GlobalConfiguration } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"
import { UserOpts } from "./og"

/**
 * Get an array of `FontOptions` (for satori) given google font names
 * @param headerFontName name of google font used for header
 * @param bodyFontName name of google font used for body
 * @returns FontOptions for header and body
 */
export async function getKoreanSatoriFont(headerFontName: string, bodyFontName: string) {
  const headerWeight = 700 as FontWeight
  const bodyWeight = 400 as FontWeight

  // Fetch fonts with Korean subset support
  const headerFont = await fetchKoreanTtf(headerFontName, headerWeight)
  const bodyFont = await fetchKoreanTtf(bodyFontName, bodyWeight)

  // Convert fonts to satori font format and return
  const fonts: SatoriOptions["fonts"] = [
    { name: headerFontName, data: headerFont, weight: headerWeight, style: "normal" },
    { name: bodyFontName, data: bodyFont, weight: bodyWeight, style: "normal" },
  ]
  return fonts
}

/**
 * Get the `.ttf` file of a google font with Korean subset support
 * @param fontName name of google font
 * @param weight what font weight to fetch font
 * @returns `.ttf` file of google font
 */
async function fetchKoreanTtf(fontName: string, weight: FontWeight): Promise<ArrayBuffer> {
  try {
    // Properly encode font name for URL
    const encodedFontName = fontName.replace(/ /g, '+')
    
    // Get css file from Google Fonts API v2 with Korean subset
    const cssResponse = await fetch(`https://fonts.googleapis.com/css2?family=${encodedFontName}:wght@${weight}&subset=korean`)
    const css = await cssResponse.text()

    // Extract .ttf url from css file
    const urlRegex = /url\((https:\/\/fonts.gstatic.com\/s\/.*?.ttf)\)/g
    const match = urlRegex.exec(css)

    if (!match) {
      // Fallback to regular font if Korean subset is not available
      const fallbackResponse = await fetch(`https://fonts.googleapis.com/css2?family=${encodedFontName}:wght@${weight}`)
      const fallbackCss = await fallbackResponse.text()
      const fallbackMatch = urlRegex.exec(fallbackCss)
      
      if (!fallbackMatch) {
        throw new Error("Could not fetch font")
      }
      
      // Retrieve font data as ArrayBuffer
      const fontResponse = await fetch(fallbackMatch[1])
      const fontData = await fontResponse.arrayBuffer()
      return fontData
    }

    // Retrieve font data as ArrayBuffer
    const fontResponse = await fetch(match[1])
    const fontData = await fontResponse.arrayBuffer()

    return fontData
  } catch (error) {
    throw new Error(`Error fetching font: ${error}`)
  }
}

// Custom social image component optimized for Korean text
export const koreanSocialImage = (
  cfg: GlobalConfiguration,
  { colorScheme }: UserOpts,
  title: string,
  description: string,
  fonts: SatoriOptions["fonts"],
  _fileData: QuartzPluginData,
) => {
  // Setup to access image
  const iconPath = `https://${cfg.baseUrl}/static/icon.png`
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        width: "100%",
        backgroundColor: cfg.theme.colors[colorScheme].light,
        padding: "3rem",
        gap: "2rem",
        borderTop: `10px solid ${cfg.theme.colors[colorScheme].secondary}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
          gap: "1.5rem",
        }}
      >
        <img src={iconPath} width={90} height={90} style={{ borderRadius: "12px" }} />
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              color: cfg.theme.colors[colorScheme].secondary,
              fontSize: 28,
              margin: 0,
              padding: 0,
              fontFamily: fonts[1].name,
            }}
          >
            {cfg.pageTitle}
          </p>
          <p
            style={{
              color: cfg.theme.colors[colorScheme].gray,
              fontSize: 18,
              margin: 0,
              padding: 0,
              fontFamily: fonts[1].name,
            }}
          >
            blog.eunice-hong.com
          </p>
        </div>
      </div>
      
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: cfg.theme.colors[colorScheme].lightgray,
          margin: "0.5rem 0",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: "100%",
          flex: 1,
        }}
      >
        <h1
          style={{
            color: cfg.theme.colors[colorScheme].dark,
            fontSize: 60,
            lineHeight: 1.3,
            margin: 0,
            padding: 0,
            fontFamily: fonts[0].name,
            wordBreak: "keep-all",
          }}
        >
          {title}
        </h1>
        
        <p
          style={{
            color: cfg.theme.colors[colorScheme].darkgray,
            fontSize: 30,
            lineHeight: 1.4,
            margin: 0,
            padding: 0,
            fontFamily: fonts[1].name,
            lineClamp: 3,
            wordBreak: "keep-all",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
} 