window.onload = window.matchMedia('(prefers-color-scheme: dark)').matches && toggleDark();

window.onscroll = function(){
	let progress = (window.scrollY / (document.body.clientHeight - window.innerHeight)) * 100;
	let progress_bar = document.querySelector("#main-progress-bar");
	let to_top = document.querySelector("#main-to-top");
	let to_top_threshold = 10;
	// update progress bar
	if (progress_bar != null){
		progress_bar.style.width = progress.toString() + "%";
	}
	// update to-top button with animation
	if (to_top != null) {
		if (progress > to_top_threshold && to_top.classList.contains("hide")){
			to_top.className = "to-top-btn";
		} else if (progress <= to_top_threshold && !to_top.classList.contains("hide")){
			to_top.style.animation = "fade-out 0.5s";
			setTimeout(() => to_top.removeAttribute('style') || (to_top.className = "to-top-btn hide"), 500);
		}
	}
}

function pageInit(){
	let navbar = document.querySelector("#nav-navbar");
	let is_light = navbar.classList.contains("bg-light");
	let tables = document.querySelectorAll(".table");
	// update table
	if (!is_light && tables != null){
		for(let i = 0; tables != null && i < tables.length; i++){
			tables[i].classList.toggle("table-dark");
		}
	}
	// initialize about images
	aboutImgInit();

	// initialize pop-up images
	popupInit();
}

/* special bar related features */
function toggleSpecialBar(){
	let special_bar = document.querySelector("#nav-special-bar");
	// update special bar
	if (special_bar != null){
		special_bar.className = special_bar.classList.contains("hide") ? "navbar navbar-expand-lg justify-content-center my-sm-3" : "hide";
	}
}

function align(){
	let section_headings = document.querySelectorAll(".section-heading");
	let heading_className = "section-heading ";
	// update section headings
	if (section_headings != null && section_headings.length > 0){
		heading_className += section_headings[0].classList.contains("text-start") ? "text-center" : 
							 section_headings[0].classList.contains("text-center") ? "text-end" : "text-start";
		for(let i = 0; i < section_headings.length; i++){
			section_headings[i].className = heading_className;
		}
	}
}

function toggleDark(){
	let theme = document.querySelector("#theme-css");
	let navbar = document.querySelector("#nav-navbar");
	let dark_btn = document.querySelector("#nav-dark-btn");
	let tables = document.querySelectorAll(".table");
	let is_light = navbar.classList.contains("bg-light");
	let nav_className = "navbar navbar-expand-md justify-content-center my-sm-3 ";
	// update css
	if(theme != null){
		theme.href = is_light ? "./css/style-dark.css" : "./css/style-light.css";
	}
	// update navbar
	if (navbar != null){
		navbar.className = nav_className + (is_light ? "bg-dark" : "bg-light");
	}
	// update dark mode button
	if (dark_btn != null){
		dark_btn.textContent = is_light ? "Light" : "Dark";
	}
	// update tables
	for(let i = 0; tables != null && i < tables.length; i++){
		tables[i].classList.toggle("table-dark");
	}
}

function toggleScrollBar(){
	let scroll_bar = document.querySelector("#main-scroll-bar");
	// update scroll bar
	if(scroll_bar != null){
		scroll_bar.className = scroll_bar.classList.contains("hide") ? "progress sticky-top" : "hide";
	}
}

/* pop-up related features */
function addPopupOnClick(popup_box, popup_img, popup_caption, target, src, innerText){
	target.onclick = function(){
		popup_box.classList.toggle("hide");
		popup_img.src = src;
		popup_caption.innerText = innerText;
	}
}

function popupInit(){
	let popup_box = document.querySelector("#main-popup-box");
	let popup_img = document.querySelector("#main-popup-img");
	let popup_caption = document.querySelector("#main-popup-caption");
	let popup_close = document.querySelector("#main-popup-close");
	let estr_cuhk = document.querySelector("#popup-estr-cuhk");
	let pkm_team = document.querySelector("#popup-pkm-team");
	let ptcg_deck = document.querySelector("#popup-ptcg-deck");
	// set onClick event on close button
	popup_close.onclick = function(){
		popup_box.classList.toggle("hide");
	}
	// set onClick event on links
	if(estr_cuhk != null)
		addPopupOnClick(popup_box, popup_img, popup_caption, estr_cuhk, 
			"./img/popup/estr_cuhk.png", 
			"Exposure to the admission brochure (2022-23) of the Faculty of Engineering, CUHK.");
	if(pkm_team != null)
		addPopupOnClick(popup_box, popup_img, popup_caption, pkm_team, 
			"./img/popup/pkm_team.jpg",
			"My previous (very long time ago...) Pokemon team.");
	if(ptcg_deck != null)
		addPopupOnClick(popup_box, popup_img, popup_caption, ptcg_deck, 
			"./img/popup/ptcg_deck.jpg",
			"My current (2025/01) PTCG deck.");
	return true;
}

/* other features */
toTop = () => window.scrollTo({top: 0, behavior: 'smooth'});

const num_files = 5;

function setCookie(key, value, duration){
    let exp = new Date();
    exp.setTime(exp.getTime() + (duration * 86400000));
    document.cookie = key + "=" + value + ";expires=" + exp.toGMTString() + ";path=/";
}

function getCookie(key){
    let cookie_dec = decodeURIComponent(document.cookie);
    let vals = cookie_dec.split(';');
	for (let i = 0; i < vals.length; i++){
		let val = vals[i].replace(" ", "");
		if (val.indexOf(key + "=") == 0)
			return val.substring(key.length + 1, val.length);
	}
    return "";
}

function imgIsValid(img_str){
	let img_int = parseInt(img_str, 10)
	return Number.isNaN(img_int) || img_int < 0 || img_int >= num_files ? -1 : img_int
}

function aboutImgInit(){
	let img_str = getCookie("img_id");
	let img_int = imgIsValid(img_str);
	let about_pic = document.querySelector("#about-pic");
	if (img_int != -1 && about_pic != null)
		about_pic.src = "./img/about/image_" + img_int + ".jpg";
}

function setImage(){
	img_str = prompt("Please enter a number between 0 and " + (num_files - 1), "");
	if (imgIsValid(img_str) != -1)
		setCookie("img_id", img_str, 365);
	aboutImgInit();
}
