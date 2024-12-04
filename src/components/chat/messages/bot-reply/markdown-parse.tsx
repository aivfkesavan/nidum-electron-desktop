import MarkdownPreview from '@uiw/react-markdown-preview';

function MarkdownParse({ response = "" }) {
  return (
    <MarkdownPreview
      source={response}
      style={{ background: "transparent", fontSize: ".8rem" }}
      wrapperElement={{
        "data-color-mode": "dark"
      }}
      className='mark-down-wrap [&_ul]:list-decimal [&_ol]:list-decimal'
    />
  )
}

export default MarkdownParse
