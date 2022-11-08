"use strict";

const createContentElement = (section) => {
	const contentElement = document.createElement("div");
	contentElement.classList.add("content");

	const titleElement = document.createElement("h2");
	titleElement.innerHTML = section.title;
	contentElement.appendChild(titleElement);

	const subTitleElement = document.createElement("h3");
	subTitleElement.innerHTML = section.subTitle;
	contentElement.appendChild(subTitleElement);

	const textElement = document.createElement("p");
	textElement.innerHTML = section.text;
	contentElement.appendChild(textElement);

	return contentElement;
}

const createSectionElement = (section) => {
	const sectionElement = document.createElement("div");
	sectionElement.classList.add("section");

	const beadElement = document.createElement("div")
	beadElement.classList.add("bead");
	sectionElement.appendChild(beadElement);

	const contentElement = createContentElement(section);
	sectionElement.appendChild(contentElement);

	const timelineElement = document.querySelector("#timeline");
	timelineElement.appendChild(sectionElement);
}

const url = "data.json";

async function getJson() {
	let response = await fetch(url);
	if (response.ok) {
		let data = await response.json();
		console.log(data);
		return data;
	} else {
		console.log("HTTP-Error: " + response.status);
	}
}

(async () => {
	const data = await getJson();
	data.forEach(createSectionElement);

	function qs(selector, all = false) {
		return all ? document.querySelectorAll(selector) : document.querySelector(selector);
	}

	function scrollHandler(e) {
		const {
			scrollY
		} = window;
		up = scrollY < prevScrollY;
		down = !up;
		const timelineRect = timeline.getBoundingClientRect();
		const lineRect = line.getBoundingClientRect(); // const lineHeight = lineRect.bottom - lineRect.top;

		const dist = targetY - timelineRect.top;

		if (down && !full) {
			set = Math.max(set, dist);
			line.style.bottom = `calc(100% - ${set}px)`;
		}

		if (dist > timeline.offsetHeight + 50 && !full) {
			full = true;
			line.style.bottom = `-50px`;
		}

		sections.forEach(item => {
			// console.log(item);
			const rect = item.getBoundingClientRect(); //     console.log(rect);

			if (rect.top + item.offsetHeight / 5 < targetY) {
				item.classList.add('show-me');
			}
		}); // console.log(up, down);

		prevScrollY = window.scrollY;
	}

	const sections = qs('.section', true);
	const timeline = qs('.timeline');
	const line = qs('.line');
	line.style.bottom = `calc(100% - 20px)`;
	let prevScrollY = window.scrollY;
	let up, down;
	let full = false;
	let set = 0;
	const targetY = window.innerHeight * .8;
	scrollHandler();
	line.style.display = 'block';
	window.addEventListener('scroll', scrollHandler);
})();

