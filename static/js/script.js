console.log('%cCopyright © 2024 zyyo.net',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
tc[0].addEventListener('click', function (event) {
    pop();
});
tc_main[0].addEventListener('click', function (event) {
    event.stopPropagation();
});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Light";
    var tanChiShe = document.getElementById("tanChiShe");

    function changeTheme(theme) {
        tanChiShe.src = "./static/svg/snake-" + theme + ".svg";
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }

    var Checkbox = document.getElementById('myonoffswitch')
    Checkbox.addEventListener('change', function () {
        if (themeState == "Dark") {
            changeTheme("Light");
        } else if (themeState == "Light") {
            changeTheme("Dark");
        } else {
            changeTheme("Dark");
        }
    });

    if (themeState == "Dark") {
        Checkbox.checked = false;
    }

    changeTheme(themeState);
});

var pageLoading = document.querySelector("#zyyo-loading");

// DOM 就绪即淡出加载页，不等待全部资源下载完成；1.5s 兜底防止极端情况下卡在加载页
function hideLoading() {
    if (pageLoading) {
        pageLoading.style.opacity = '0';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(hideLoading, 100);
    });
} else {
    setTimeout(hideLoading, 100);
}

setTimeout(hideLoading, 1500);

// 光点粒子层：与壁纸的光效呼应。约束——
//   prefers-reduced-motion 时整个层不创建；页面隐藏即暂停；
//   DPR 上限 1.5、数量随视口宽度封顶 42，保证低端机开销可忽略
(function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    var canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-99999998;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var motes = [];
    var COUNT = Math.min(42, Math.max(18, Math.floor(window.innerWidth / 32)));
    var raf = 0;
    var running = true;

    function resize() {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
    }

    function spawn(fromBottom) {
        return {
            x: Math.random() * canvas.width,
            y: fromBottom ? canvas.height + 24 * dpr : Math.random() * canvas.height,
            r: (1 + Math.random() * 2.2) * dpr,
            vy: (0.15 + Math.random() * 0.45) * dpr,
            vx: (Math.random() - 0.5) * 0.12 * dpr,
            a: 0.15 + Math.random() * 0.5,
            tw: Math.random() * Math.PI * 2
        };
    }

    resize();
    for (var i = 0; i < COUNT; i++) {
        motes.push(spawn(false));
    }

    function frame() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < motes.length; i++) {
            var m = motes[i];
            m.y -= m.vy;
            m.x += m.vx;
            m.tw += 0.03;
            if (m.y < -24 * dpr || m.x < -24 * dpr || m.x > canvas.width + 24 * dpr) {
                motes[i] = spawn(true);
                continue;
            }
            var alpha = m.a * (0.6 + 0.4 * Math.sin(m.tw));
            ctx.beginPath();
            ctx.fillStyle = 'rgba(190, 220, 255, ' + alpha.toFixed(3) + ')';
            ctx.arc(m.x, m.y, m.r, 0, 6.283);
            ctx.fill();
        }
        raf = requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        if (running) {
            raf = requestAnimationFrame(frame);
        } else {
            cancelAnimationFrame(raf);
        }
    });

    window.addEventListener('resize', resize);
    // 兜底：个别环境首次布局时 innerWidth 可能为 0，load 后再校准一次
    window.addEventListener('load', resize);

    raf = requestAnimationFrame(frame);
    // 直接同步淡入，不依赖 rAF（后台标签页 rAF 会被冻结，导致迟迟不显示）
    canvas.classList.add('on');
})();
