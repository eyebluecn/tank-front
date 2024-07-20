import MimeUtil from '@/common/util/MimeUtil'
import { message } from 'antd'
import { useContext } from 'react'
import { GlobalContext } from '@/contexts/globalContext'
import Preference from '@/models/Preference'
import PreviewEngine, { IPreviewEngine } from '@/models/sub/PreviewEngine'
import BrowserPreviewer from '@/pages/widget/previewer/BrowserPreviewer'

const usePreviewer = () => {
  const { preference } = useContext(GlobalContext)

  // todo needToken的处理，交给外层
  const previewFile = (options: { name: string; size: number; url: string }) => {
    const { name: fileName, size: fileSize, url: fileUrl } = options
    console.log('previewFile', fileName, fileSize, fileUrl)

    const extension = MimeUtil.getExtensionWithoutDot(fileName)
    if (!extension) {
      message.warning(fileName + ' 没有后缀名，无法预览')
      return
    }

    if (!preference) return
    const preferenceEngines = (new Preference(preference).getPreviewConfig().previewEngines || []).map((en) => new PreviewEngine(en))

    let previewEngine: PreviewEngine | undefined = undefined
    // 先寻找用户自定义的预览引擎
    for (let engine of preferenceEngines) {
      if (engine.canPreview(fileName)) {
        previewEngine = engine
        break
      }
    }

    // 寻找官方默认的预览引擎
    if (!previewEngine) {
      const defaultEngines = PreviewEngine.defaultPreviewEngines()
      for (let engine of defaultEngines) {
        if (engine.canPreview(fileName)) {
          previewEngine = engine
          break
        }
      }
    }

    if (!previewEngine) {
      message.warning(fileName + ' 无法预览')
      return
    }

    let targetUrl = previewEngine.url
    targetUrl = targetUrl.replace('{originUrl}', fileUrl)
    targetUrl = targetUrl.replace('{url}', encodeURIComponent(fileUrl))

    if (previewEngine.previewInSite) {
      BrowserPreviewer.show(fileName, targetUrl, fileSize)
    } else {
      window.open(targetUrl)
    }
  }

  return {
    previewFile,
  }
}

export default usePreviewer
