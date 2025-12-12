import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const SidebarToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <>
      <button
        class="sidebar-toggle left-toggle"
        id="left-sidebar-toggle"
        aria-label="Toggle left sidebar"
        title="Toggle Explorer (Ctrl+B)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>
      <button
        class="sidebar-toggle right-toggle"
        id="right-sidebar-toggle"
        aria-label="Toggle right sidebar"
        title="Toggle Info Panel (Ctrl+I)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
    </>
  )
}

SidebarToggle.afterDOMLoaded = `
  const leftToggle = document.getElementById('left-sidebar-toggle');
  const rightToggle = document.getElementById('right-sidebar-toggle');
  const leftSidebar = document.querySelector('.sidebar.left');
  const rightSidebar = document.querySelector('.sidebar.right');

  // Load saved state from localStorage
  const leftSidebarHidden = localStorage.getItem('leftSidebarHidden') === 'true';
  const rightSidebarHidden = localStorage.getItem('rightSidebarHidden') === 'true';

  // Apply saved state
  if (leftSidebarHidden && leftSidebar) {
    leftSidebar.classList.add('sidebar-hidden');
  }
  if (rightSidebarHidden && rightSidebar) {
    rightSidebar.classList.add('sidebar-hidden');
  }

  // Left sidebar toggle
  if (leftToggle && leftSidebar) {
    leftToggle.addEventListener('click', () => {
      leftSidebar.classList.toggle('sidebar-hidden');
      const isHidden = leftSidebar.classList.contains('sidebar-hidden');
      localStorage.setItem('leftSidebarHidden', isHidden.toString());
    });
  }

  // Right sidebar toggle
  if (rightToggle && rightSidebar) {
    rightToggle.addEventListener('click', () => {
      rightSidebar.classList.toggle('sidebar-hidden');
      const isHidden = rightSidebar.classList.contains('sidebar-hidden');
      localStorage.setItem('rightSidebarHidden', isHidden.toString());
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+B for left sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      if (leftSidebar) {
        leftSidebar.classList.toggle('sidebar-hidden');
        const isHidden = leftSidebar.classList.contains('sidebar-hidden');
        localStorage.setItem('leftSidebarHidden', isHidden.toString());
      }
    }
    // Ctrl+I for right sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      if (rightSidebar) {
        rightSidebar.classList.toggle('sidebar-hidden');
        const isHidden = rightSidebar.classList.contains('sidebar-hidden');
        localStorage.setItem('rightSidebarHidden', isHidden.toString());
      }
    }
  });
`

export default (() => SidebarToggle) satisfies QuartzComponentConstructor
