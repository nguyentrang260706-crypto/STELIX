/* DENSO Cortex Agent – Tương tác khung sườn & Tải tệp lên */
(() => {
  const $ = id => document.getElementById(id);
  const box = $('messages'), input = $('chatInput'), form =$('chatForm');
  const picker = $('filePicker'), chips =$('chips');
  const EMPTY_CHAT = box.innerHTML;
  let files = [], msgSeq = 0;

  const time = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  function addMsg(text, who = 'bot') {
    box.querySelector('.empty-chat')?.remove();
    const id = 'm' + ++msgSeq;
    const el = document.createElement('div');
    el.className = 'msg ' + who; el.dataset.id = id;
    const body = document.createElement('div'); body.className = 'txt'; body.textContent = text;
    const meta = document.createElement('div'); meta.className = 'msg-meta';
    meta.innerHTML = `<time>${time()}</time>`;
    if (who === 'bot') {
      meta.insertAdjacentHTML('beforeend',
        '<span class="fb"><button data-v="up">👍 Hữu ích</button><button data-v="down">👎</button></span>');
    }
    el.append(body, meta); box.appendChild(el); box.scrollTop = box.scrollHeight;
    return el;
  }

  // Gửi tin nhắn chat kèm danh sách file nếu có
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q && !files.length) return;
    
    let displayTxt = q;
    if (files.length > 0) {
      displayTxt += `\n📎 [Đã đính kèm: ${files.map(f => f.name).join(', ')}]`;
    }

    addMsg(displayTxt, 'user');
    input.value = '';
    files = [];
    renderChips();

    setTimeout(() => {
      addMsg('Hệ thống đang xử lý câu hỏi và tài liệu của bạn...', 'bot');
    }, 500);
  });

  // Xử lý nút Tải tệp lên (mở hộp thoại chọn file)
  $('attachBtn').onclick = () => {
    picker.click();
  };

  picker.addEventListener('change', () => {
    if (picker.files.length > 0) {
      files.push(...picker.files);
      picker.value = ''; // Reset để có thể chọn lại file cũ nếu muốn
      renderChips();
    }
  });

  // Hiển thị các thẻ tệp đã chọn (Chips) dưới khung chat
  function renderChips() {
    chips.innerHTML = '';
    files.forEach((f, index) => {
      const chip = document.createElement('span');
      chip.style.cssText = 'background: #eef4ff; border: 1px solid #d0e1fd; padding: 2px 8px; border-radius: 4px; font-size: 11px; display: flex; align-items: center; gap: 4px; color: var(--navy); margin-bottom: 4px;';
      chip.innerHTML = `📄 ${f.name} <button type="button" style="border:0; background:none; cursor:pointer; font-weight:bold; color:#d6001c;">×</button>`;
      
      // Nút xóa file trong danh sách chọn
      chip.querySelector('button').onclick = () => {
        files.splice(index, 1);
        renderChips();
      };
      chips.appendChild(chip);
    });
  }

  // Nút tạo phiên chat mới
  $('newChat').onclick = () => {
    box.innerHTML = EMPTY_CHAT;
    files = [];
    renderChips();
  };

  // Menu Sidebar chuyển trang
  const crumbEl = document.querySelector('.crumb');
  const pageTitleEl = document.querySelector('.left h2');
  const leftSection = document.querySelector('.left');
  const dashboardHTML = leftSection.innerHTML;

  document.querySelectorAll('.sidebar nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');

      const pageName = a.textContent.replace(/^[^\w\s]+\s*/, '').trim();
      if (crumbEl) crumbEl.innerHTML = `Dashboard <span>›</span> ${pageName}`;
      if (pageTitleEl) pageTitleEl.textContent = pageName;

      if (pageName === 'Dashboard') {
        leftSection.innerHTML = dashboardHTML;
      } else {
        leftSection.innerHTML = `
          <div class="crumb">Dashboard <span>›</span> ${pageName}</div>
          <h2>${pageName}</h2>
          <div class="card" style="padding: 40px; text-align: center; min-height: 400px; display: grid; place-items: center; color: var(--muted);">
            <div>
              <div style="font-size: 40px; margin-bottom: 10px;">🚧</div>
              <b style="font-size: 16px; color: var(--navy);">Nội dung trang "${pageName}" đang được phát triển</b>
              <p style="font-size: 12px; margin-top: 6px;">Khu vực này sẽ hiển thị dữ liệu chi tiết khi kết nối với Backend.</p>
            </div>
          </div>
        `;
      }
    });
  });

  // Tìm kiếm Topbar
  $('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      alert(`Đang tìm kiếm: ${e.target.value.trim()}`);
    }
  });

  // Nút thông báo
  const bell = $('bell');
  let notiPanel = document.getElementById('notiPanel');
  if (!notiPanel) {
    notiPanel = document.createElement('div');
    notiPanel.id = 'notiPanel';
    notiPanel.className = 'card';
    notiPanel.style.cssText = 'position:absolute; right:40px; top:65px; width:240px; padding:12px; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:100; display:none; font-size:12px;';
    notiPanel.innerHTML = '<b>Thông báo hệ thống</b><p style="color:#7a869c; margin-top:6px;">Chưa có thông báo mới.</p>';
    document.body.appendChild(notiPanel);
  }
  bell.onclick = (e) => {
    e.stopPropagation();
    notiPanel.style.display = notiPanel.style.display === 'none' ? 'block' : 'none';
  };
  document.addEventListener('click', () => { notiPanel.style.display = 'none'; });
})();