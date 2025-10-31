function pageInit() {
	let menu = document.querySelector("#menu");
	let is_light = menu.classList.contains("bg-light");
	let tables = document.querySelectorAll(".table");

	// update table
	if (!is_light && tables != null) {
		for(let i = 0; tables != null && i < tables.length; i++) {
			tables[i].classList.toggle("table-dark");
		}
	}

	// initialize align
	alignInit();

	// initialize about images
	aboutImgInit();

	// initialize pop-up images
	popupInit();

	// initialize paper abstracts
	paperInit();
}


/* utilities */
function setCookie(key, value, duration) {
    let exp = new Date();
    exp.setTime(exp.getTime() + (duration * 86400000));
    document.cookie = key + "=" + value + ";expires=" + exp.toGMTString() + ";path=/";
}

function getCookie(key) {
    let cookie_dec = decodeURIComponent(document.cookie);
    let vals = cookie_dec.split(';');
	for (let i = 0; i < vals.length; i++) {
		let val = vals[i].replace(" ", "");
		if (val.indexOf(key + "=") == 0)
			return val.substring(key.length + 1, val.length);
	}
    return "";
}


/* align */
function alignInit() {
	// get cookie
	let align_str = getCookie("align_mode");
	let align_int = parseInt(align_str, 10);
	let heading_className = "section-heading ";
	switch(align_int) {
		case 1:
			heading_className += "text-center";
			break;
		case 2:
			heading_className += "text-end";
			break;
		default:
			heading_className += "text-start";
	}

	// update section headings
	let section_headings = document.querySelectorAll(".section-heading");
	if (section_headings != null && section_headings.length > 0) {
		for(let i = 0; i < section_headings.length; i++) {
			section_headings[i].className = heading_className;
		}
	}
}

function align() {
	let align_str = getCookie("align_mode");
	let align_int = parseInt(align_str, 10);
	switch(align_int) {
		case 1:
		case 2:
			setCookie("align_mode", (align_int + 1) % 3, 365);
			break;
		default:
			setCookie("align_mode", 1, 365);
	}
	alignInit();
}


/* dark mode */
window.onload = window.matchMedia('(prefers-color-scheme: dark)').matches && toggleDark();

function toggleDark() {
	let theme = document.querySelector("#theme-css");
	let menu = document.querySelector("#menu");
	let dark_btn = document.querySelector("#nav-dark-btn");
	let tables = document.querySelectorAll(".table");
	let is_light = menu.classList.contains("bg-light");
	// update css
	if(theme != null) {
		theme.href = is_light ? "./css/style-dark.css" : "./css/style-light.css";
	}
	// update navbar
	if (menu != null) {
		menu.classList.toggle("bg-light");
		menu.classList.toggle("bg-dark");
	}
	// update dark mode button
	if (dark_btn != null) {
		dark_btn.textContent = is_light ? "Light" : "Dark";
	}
	// update tables
	for(let i = 0; tables != null && i < tables.length; i++) {
		tables[i].classList.toggle("table-dark");
	}
}


/* scroll bar and to-top button */
window.onscroll = function() {
	let progress = (window.scrollY / (document.body.clientHeight - window.innerHeight)) * 100;
	let progress_bar = document.querySelector("#main-progress-bar");
	let to_top = document.querySelector("#main-to-top");
	let to_top_threshold = 10;

	// update progress bar
	if (progress_bar != null) {
		progress_bar.style.width = progress.toString() + "%";
	}

	// update to-top button with animation
	if (to_top != null) {
		if (progress > to_top_threshold && to_top.classList.contains("hide")) {
			to_top.className = "to-top-btn";
		} else if (progress <= to_top_threshold && !to_top.classList.contains("hide")) {
			to_top.style.animation = "fade-out 0.5s";
			setTimeout(() => to_top.removeAttribute('style') || (to_top.className = "to-top-btn hide"), 500);
		}
	}
}

toTop = () => window.scrollTo({top: 0, behavior: 'smooth'});

function toggleScrollBar() {
	let scroll_bar = document.querySelector("#main-scroll-bar");
	// update scroll bar
	if(scroll_bar != null) {
		scroll_bar.classList.toggle("hide");
		scroll_bar.classList.toggle("progress");
	}
}


/* about images */
const num_img = 6;

function imgIsValid(img_str) {
	let img_int = parseInt(img_str, 10);
	return Number.isNaN(img_int) || img_int < 0 || img_int >= num_img ? -1 : img_int;
}

function aboutImgInit() {
	let img_str = getCookie("img_id");
	let img_int = imgIsValid(img_str);
	let about_pic = document.querySelector("#about-pic");
	if (img_int != -1 && about_pic != null)
		about_pic.src = "./img/about/image-" + img_int + ".jpg";
}

function setImage() {
	img_str = prompt("Please enter a number between 0 and " + (num_img - 1), "");
	if (imgIsValid(img_str) != -1)
		setCookie("img_id", img_str, 365);
	aboutImgInit();
}


/* pop-up images */
const popup_srcs = {
	"popup-estr-cuhk": "./img/popup/estr-cuhk.png",
	"popup-pkm-team": "./img/popup/pkm-team.jpg",
	"popup-ptcg-deck": "./img/popup/ptcg-deck.jpg"
}

const popup_texts = {
	"popup-estr-cuhk": "Exposure to the admission brochure (2022-23) of the Faculty of Engineering, CUHK.",
	"popup-pkm-team": "My previous (very long time ago...) Pokemon team.",
	"popup-ptcg-deck": "My current (2025/06) PTCG deck."
};

function popupInit() {
	let popup_box = document.querySelector("#main-popup-box");
	let popup_img = document.querySelector("#main-popup-img");
	let popup_caption = document.querySelector("#main-popup-caption");
	let popup_close = document.querySelector("#main-popup-close");
	// set onClick event on links
	let popups = document.querySelectorAll(".popup");
	for(let i = 0; popups != null && i < popups.length; i++) {
		let id = popups[i].id;
		let src = popup_srcs[id];
		let text = popup_texts[id];
		if (src != null && text != null) {
			popups[i].onclick = function() {
				popup_box.classList.toggle("hide");
				popup_img.src = src;
				popup_caption.innerText = text;
			}
		}
	}
	// set onClick event on close button
	popup_close.onclick = function() {
		popup_box.classList.toggle("hide");
	}
}


/* paper abstracts */
function paperInit() {
	let papers = document.querySelectorAll(".paper");
	for(let i = 0; papers != null && i < papers.length; i++) {
		let abs_btn = papers[i].querySelector(".abs-btn .no-dec");
		let abstract = papers[i].querySelector(".abstract");
		if (abs_btn != null && abstract != null) {
			abs_btn.onclick = function() {
				abstract.classList.toggle("hide");
				abs_btn.textContent = abstract.classList.contains("hide") ? "View Abstract ▸" : "Hide Abstract ▾";
			}
		}
	}
}


/* special bar */
function toggleSpecialBar() {
	let special_bar = document.querySelector("#nav-special-bar");
	// update special bar
	if (special_bar != null) {
		special_bar.classList.toggle('hide');
	}
}
