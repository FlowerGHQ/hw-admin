// 侧边栏
const sidebar = document.querySelector('#sidebar');
// 描述文本
const descriptionContent = document.querySelector('#description-content');
// 照片
const img = document.querySelector('#img');

let selectIndex = 0; // 点击的索引

for (const [i, item] of arr.entries()) {
    var divElement = document.createElement('div');
    divElement.setAttribute('id', 'sidebar-item');

    if (selectIndex === i) {
        divElement.setAttribute('class', 'sidebar-item-active');
    } else {
        divElement.setAttribute('class', 'sidebar-item');
    }

    if (i > 0) {
        divElement.classList.add('m-t-10');
    }
    divElement.innerText = item.text;
    sidebar.appendChild(divElement);
}

img.setAttribute('src', arr[selectIndex].img);
descriptionContent.innerText = arr[selectIndex].description;

// 获取所有兄弟元素
const sidebarItem = document.querySelectorAll('#sidebar-item');

// 为每个兄弟元素添加点击事件监听器
sidebarItem.forEach((sibling, index) => {
    sibling.addEventListener('click', () => {
        // 清除其他兄弟元素的样式
        sidebarItem.forEach(s => {
            s.classList.remove('sidebar-item-active');
            s.classList.add('sidebar-item');
        });

        // 为当前点击的子元素添加样式
        sibling.classList.add('sidebar-item-active');
        selectIndex = index;

        // 替换照片
        img.setAttribute('src', arr[selectIndex].img);
        descriptionContent.innerText = arr[selectIndex].description;
    });
});
