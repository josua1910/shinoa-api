document.addEventListener("DOMContentLoaded", () => {
  hljs.highlightAll();
  let codeBlock_pro = document.getElementById("code_pro").innerText
  let codeBlock_noob = document.getElementById("code_noob").innerText
  let copyButton = document.getElementById("copy-button")
  let checkbox = document.getElementById("toggle")

  const copyTextHandler = () => {
    navigator.clipboard.writeText(document.getElementById("code").innerText).then(
      () => {
        copyButton.innerHTML = 'Copied <i class="far fa-check-circle"></i>'
        setTimeout(() => {
          copyButton.innerText = "Copy"
        }, 2500)
      },
      () => {
        console.log("Error writing to the clipboard")
      }
    )
  }
  const tukar = () => {
    if (checkbox.checked) {
      hljs.highlightAll.called = false
      document.getElementById("code").innerText = codeBlock_pro
      hljs.highlightAll()
    } else {
      hljs.highlightAll.called = false
      document.getElementById("code").innerText = codeBlock_noob
      hljs.highlightAll();
    }
  }
  checkbox.addEventListener("click", tukar)
  copyButton.addEventListener("click", copyTextHandler)
})