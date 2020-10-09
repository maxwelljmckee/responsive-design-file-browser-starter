class DirectoryTreeNode {
  constructor(name, type, lastModifiedTime) {
    this.name = name;
    this.type = type;
    this.lastModifiedTime = lastModifiedTime;
    this.children = [];
  }

  getIconTypeName() {
    if (this.type === 'directory') {
      return this.name;
    }

    if (this.type === 'file') {
      const dotIndex = this.name.lastIndexOf('.');
      if (dotIndex >= 0) {
        return this.name.substring(dotIndex + 1).toLowerCase();
      }
      return this.name;
    }

    return '';
  }

  addChild(child) {
    this.children.push(child);
  }
}

function updateVisualTree(element, directoryTreeNode) {
  const ul = document.createElement('ul');
  ul.classList.add('tree');
  for (let child of directoryTreeNode.children) {
    updateVisualTreeEntry(ul, child);
  }
  element.appendChild(ul);
}

function updateVisualTreeEntry(treeElement, child) {
  const li = document.createElement('li');
    li.classList.add('tree-entry');
    if (child.type === 'file') {
      li.innerHTML = `
        <div class="tree-entry__disclosure tree-entry__disclosure--closed></div>
        <img class="tree-entry__icon" src="/icons/file_type_${child.getIconTypeName()}.svg">
        <div class="tree-entry__name">${child.name}</div>
        <div class="tree-entry__time">${child.lastModifiedTime}</div>
      `;
      console.log(child.getIconTypeName());
    } else if (child.type === 'directory') {
      li.innerHTML = `
        <div class="tree-entry__disclosure tree-entry__disclosure--closed"></div>
        <img class="tree-entry__icon" src="/icons/folder_type_${child.getIconTypeName()}.svg">
        <div class="tree-entry__name">${child.name}</div>
        <div class="tree-entry__time">${child.lastModifiedTime}</div>
      `;
    }
    treeElement.appendChild(li);
}

// Root of the data tree in memory
const dataTreeRoot = new DirectoryTreeNode();

window.addEventListener('DOMContentLoaded', async () => {

  const overlay = document.getElementById('loading-overlay');
  try {
    const response = await fetch('/api/path');
    if (response.ok) {
      const entries = await response.json();
      for (let entry of entries) {
        const { name, type, lastModifiedTime } = entry;
        if (type !== 'directory') console.log(entry);
        const node = new DirectoryTreeNode(name, type, lastModifiedTime);
        dataTreeRoot.addChild(node);
      }
      overlay.classList.add('overlay--hidden');
    }

    const uiTreeRoot = document.querySelector('#tree-section');
    updateVisualTree(uiTreeRoot, dataTreeRoot);
  } catch (e) {
    console.error(e);
    overlay.classList.add('overlay--error');
  }

});
