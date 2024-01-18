// 侧边栏
const sidebar = document.querySelector('#sidebar')
// 照片
const img = document.querySelector('#img')

const arr = [
    {
        text: "based-on-dom (MyMask)",
        img: "https://img2.baidu.com/it/u=3361371302,3076594463&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
    },
    {
        text: "based-on-dom (MyMask)",
        img: "https://img2.baidu.com/it/u=3361371302,3076594463&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
    },
    {
        text: "based-on-dom (MyMask)",
        img: "https://img2.baidu.com/it/u=3361371302,3076594463&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
    },
    {
        text: "based-on-dom (MyMask)",
        img: "https://img2.baidu.com/it/u=3361371302,3076594463&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
    },
]

let selectIndex = 0

for (const [i, item] of arr.entries()) {
    var divElement = document.createElement('div')
    divElement.setAttribute('id', 'sidebar-item')

    if (selectIndex === i) {
        divElement.setAttribute('class', 'sidebar-item-change')
    } else {
        divElement.setAttribute('class', 'sidebar-item')
    }

    if (i > 0) {
        divElement.classList.add("m-t-10")
    }
    divElement.innerText = item.text
    sidebar.appendChild(divElement)

    img.setAttribute('src', item.img)
}

// const sidebarItem = document.querySelector('#img')

