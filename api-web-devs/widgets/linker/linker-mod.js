'use strict'

export default class Linker {

    get json() { return this.state.json.updated; }

    get svg() { return document.getElementById('svg-container').innerHTML; }
	
	get is_dirty() { return this._dirty; }
	
    constructor(elem, props) {
        this.elem = elem;
        this.props = props || {};

        this.config = props.configuration != null ? props.configuration : Linker.DefaultOptions();
		
		this.handlers = {
			reset : this.props.handlers.reset ?? this.reset,
			clear : this.props.handlers.clear ?? this.clear
		}
		
        this.state = {
            buttons: [],
            json : {
				original: null,
				updated: null
			},
            originalJsonContent: null,
            selectedSvgElements: {},
            currentButtonPicker: '',
            currentCardId: null,
            svgIdMap: new Set()
        };
		
		this._dirty = false;
		
		this.render();
    }


    emptyInnerHtml = (elem) => {
        while (elem.firstChild) elem.removeChild(elem.lastChild);
    }

    destroy = () => {
		this.emptyInnerHtml(this.elem);
    }

    createElementFromHTML = (htmlString) => {
        const div = document.createElement('div');
        
		div.innerHTML = htmlString.trim();
    }

    addHTML = (str) => {
        const elem = this.createElementFromHTML(str);
        this.elem.append(elem);
        return elem;
    }

    addHTMLTo = (toElem, str) => {
        const elem = this.createElementFromHTML(str);
        toElem.append(elem);
        return elem;
    }

    parseId = id => `#${id}`

    getJsonContent = (id) => {
        const [key, str_index] = id.split('-');
        const index = parseInt(str_index);
        return this.state.json.updated[key][index];
    }

    showCardWarning = (cardId) => {
        const warningIcon = document.getElementById(`warning-icon-${cardId}`);
        warningIcon.classList.remove('invisible');
        warningIcon.classList.add('visible');
    }

    hideCardWarning = (cardId) => {
        const warningIcon = document.getElementById(`warning-icon-${cardId}`);
        warningIcon.classList.remove('visible');
        warningIcon.classList.add('invisible');
    }

    createAssociation = () => {
        const selectedSvgElements = this.state.selectedSvgElements;
        const currentCardId = this.state.currentCardId;
        if (currentCardId) {
            const jsonElement = this.getJsonContent(currentCardId);
            jsonElement.svg = Object.keys(selectedSvgElements).map(id => id);
            if (jsonElement.svg.length === 0) {
                this.showCardWarning(currentCardId);
            } else {
                this.hideCardWarning(currentCardId);
            }
        }
    }

    recomputeCardWarnings = () => {
        var cards = document.getElementById('cards').querySelectorAll('div');
        for (const card of cards) {
            const id = card.getAttribute('id');
            if (id != null) {
                const jsonContent = this.getJsonContent(id);
                if (Array.isArray(jsonContent.svg)) {
                    if (jsonContent.svg.some(id => this.state.svgIdMap.has(id))) {
                        this.hideCardWarning(id);
                    } else {
                        this.showCardWarning(id);
                    }
                } else {
                    this.showCardWarning(id);
                }
            }
        }
    }

    clearCardSelection = () => {
        const currentCardId = this.state.currentCardId;
        if (currentCardId) {
            const card = document.getElementById(currentCardId);
            card.classList.remove('dwl-highlight-card');
            this.state.currentCardId = null;
        }
    }

    clearSvgSelections = () => {
        const self = this;
        const ids = Object.keys(self.state.selectedSvgElements);
        for (const id of ids) {
            const elem = document.querySelector(id);
            if (elem) {
                elem.setAttribute('stroke', self.state.selectedSvgElements[id].stroke);
            }
        }
        this.state.selectedSvgElements = {};
    }

    getCardContent = (buttonName, item) => {
        let contents = '';
        if (typeof item === 'object') {
            for (const key in item) {
                contents += `<div class="p-1">
                    <b>${key}</b>: ${item[key]}
                </div>`;
            }
        }
        return contents;
    }

    onCardClick = (selectedCard) => {
        this.clearSvgSelections();
        var cards = document.getElementById('cards').querySelectorAll('div');
        for (const card of cards) {
            const id = selectedCard.getAttribute('id');
            if (id === card.getAttribute('id')) {
                if (this.state.currentCardId === id) {
                    this.state.currentCardId = null;
                    card.classList.remove('dwl-highlight-card');
                } else {
                    this.state.currentCardId = id;
                    card.classList.add('dwl-highlight-card');
                    const jsonContent = this.getJsonContent(id);
                    if (Array.isArray(jsonContent.svg)) {
                        jsonContent.svg.forEach(id => {
							const elem = document.querySelector(id);
                            if (elem) {
                                const selections = { ...this.state.selectedSvgElements };
                                selections[id] = { id, stroke: elem.getAttribute('stroke')};
                                this.state.selectedSvgElements = selections;
                                elem.setAttribute('stroke', 'tomato');
                            }
                        });
                    }
                }
            } else {
                card.classList.remove('dwl-highlight-card');
            }
        }
    }

    showIcon = (svg, id) => {
        const hasAssociation = svg.some(id => this.state.svgIdMap.has(id));		
		return `
            <svg id="${id}" class="${hasAssociation ? 'invisible' : 'visible'} warning-icon position-absolute end-0 dwl-middle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
            </svg>`;
    }

    onTopLevelItemSelection = (cardsContainer, buttons, key) => {
        const jsonContent = this.state.json.updated;
        if (key !== this.state.currentButtonPicker) {
            this.clearSvgSelections();
			this.emptyInnerHtml(cardsContainer);
            this.state.currentButtonPicker = key;
            if (key == 'all') {
                let hasContent = false;
                for (const key in jsonContent) {
                    if (key in this.config) {
                        const slice = jsonContent[key];
                        if (Array.isArray(slice)) {
                            slice.forEach((item, index) => {
                                const jsonElem = jsonContent[key][index];
                                const filterCard = this.config[key].filter;
                                if (typeof filterCard  == 'function') {
                                    if (!filterCard(key, jsonElem)) {
                                        return;
                                    }
                                }
                                hasContent = true;
                                const card = this.addHTMLTo(
                                    cardsContainer,
                                    `<div id="${key}-${index}" class="card m-1 p-1 pe-4 dwl- dwl-pointer dwl-card">
                                        ${this.getCardContent(key, item)}
                                        ${this.showIcon(Array.isArray(jsonElem.svg) ? jsonElem.svg : [], `warning-icon-${key}-${index}`)}
                                    </div`
                                );
                                card.addEventListener('click', () => {
                                    this.onCardClick(card);
                                }, false);
                            });
                        }
                    }
                }
                if (!hasContent) {
                    this.addHTMLTo(cardsContainer, '<p class="p-2">Nothing found</p>');
                }
            } else {
                let hasContent = false;
                const slice = jsonContent[key];
                if (Array.isArray(slice)) {
                    slice.forEach((item, index) => {
                        const jsonElem = jsonContent[key][index];
                        const filterCard = this.config[key].filter;
                        if (typeof filterCard  == 'function') {
                            if (!filterCard(key, jsonElem)) {
                                return;
                            }
                        }
                        hasContent = true;
                        const card = this.addHTMLTo(
                            cardsContainer,
                            `<div id="${key}-${index}" class="card m-1 p-2 pe-4 dwl-pointer dwl-card">
                                ${this.getCardContent(key, item)}
                                ${this.showIcon(Array.isArray(jsonElem.svg) ? jsonElem.svg : [], `warning-icon-${key}-${index}`)}
                            </div`
                        );
                        card.addEventListener('click', () => {
                            this.onCardClick(card);
                        }, false);
                    });
                }
                if (!hasContent) {
                    this.addHTMLTo(
                        cardsContainer,
                        `<p class="p-2">${this.config[key].emptyCaption}</p>`
                    );
                }
            }
            for (const button of buttons) {
                const buttonName = button.getAttribute('data-button-type');
                button.classList.remove('btn-secondary');
                if (buttonName === key) {
                    button.classList.add('btn-primary');
                } else {
                    button.classList.add('btn-secondary');
                }
            }
        }
    }

    clone = (jsonContent) => {
        return JSON.parse(JSON.stringify(jsonContent));
    }

    reset = () => {
        this.state.json.updated = this.clone(this.state.json.original);
        this.clearSvgSelections();
        this.clearCardSelection();
        this.recomputeCardWarnings();
    }

    clear = () => {
        const jsonContent = this.state.json.updated;
        for (const key in jsonContent) {
            if (key in this.config) {
                const slice = jsonContent[key];
                if (Array.isArray(slice)) {
                    slice.forEach((_, index) => {
                        const jsonElem = jsonContent[key][index];
                        if (Array.isArray(jsonElem.svg)) {
                            jsonElem.svg = []; 
                        }
                    });
                }
            }
        }
        this.clearSvgSelections();
        this.clearCardSelection();
        this.recomputeCardWarnings();
    }

    renderSvg = (svgContainer, svgContent) => {		
        const svg = this.addHTMLTo(svgContainer, svgContent);
        svg.setAttribute('id', 'svg-content');
        const self = this;
		
		svg.querySelectorAll('g *').forEach((n, index) => {
            const existingId = n.getAttribute('id');
			
			if (!existingId) {
				const id =`e-${index}`; 
				n.setAttribute('id', id);
				self.state.svgIdMap.add(`#${id}`);
			} 
			
			else self.state.svgIdMap.add(`#${existingId}`);
			
			n.addEventListener('click', (ev) => 
				self.is_dirty = true;
			
                if (!self.state.currentCardId) return; 
                const id = self.parseId(ev.target.getAttribute('id'));
                const selections = { ...self.state.selectedSvgElements };
                if (id in self.state.selectedSvgElements) {
                    ev.target.setAttribute('stroke', selections[id].stroke);
                    delete selections[id];
                    self.state.selectedSvgElements = selections;
                } else {
                    const elem = ev.target;
                    selections[id] = { id, stroke: elem.getAttribute('stroke')};
                    elem.setAttribute('stroke', 'tomato');
                }
                self.state.selectedSvgElements = selections;
                self.createAssociation();
			});
			
			const id = self.parseId(n.getAttribute('id'));
			if (id in self.state.selectedSvgElements) {
				n.setAttribute('stroke', 'tomato');
			}
			
            n.setAttribute('pointer-events', 'fill')
			n.style.cursor = 'pointer';
		});
    }

    renderJson = (container) => {
        const buttons = [];
        const buttonContainer = this.addHTMLTo(container, `<div class="p-2" />`);
        const cardsContainer = this.addHTMLTo(container, `<div id="cards" class="h-100 d-flex flex-row flex-wrap align-content-start justify-content-center overflow-auto" />`);
        this.addHTMLTo(container, '<p class="m-2">NOTE: Input ports will be automatically associated.<p>');
        Object.keys(this.config).forEach(buttonName => {
            const caption = this.config[buttonName].caption;
            const button = this.addHTMLTo(
                buttonContainer,
                `<button type="button" class="btn btn-secondary m-1" data-button-type="${buttonName}">${caption}</button>`
            );
            buttons.push(button);
            button.addEventListener('click', () => {
                this.onTopLevelItemSelection(cardsContainer, buttons, buttonName);
            }, false);
        });
        this.state.buttons = buttons;
    }

    render() {
        this.state.json.updated = this.props.files.json;
        this.state.json.original = this.clone(this.props.files.json);
		
        const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        const container = this.addHTML(`<div class='d-flex ${width < 964 ? 'flex-column' : 'flex-row'} h-100 w-100' />`);
        
        let svgContainer = this.addHTMLTo(container, '<div id="svg-container" class="card m-1 h-100 w-100 position-relative" />');
        let jsonContainer = this.addHTMLTo(container, '<div id="json-container" class="d-flex flex-column card h-100 w-100" />');
		
        const utilityButtons = this.addHTMLTo(svgContainer, '<div class="position-absolute end-0"/>');
		
        this.addHTMLTo(
            utilityButtons,
            `<button type="button" class="btn btn-primary m-1" data-button-type="reset">Reset</button>`
        ).addEventListener('click', this.handlers.reset, false);
		
        this.addHTMLTo(
            utilityButtons,
            `<button type="button" class="btn btn-primary m-1" data-button-type="clear">Clear</button>`
        ).addEventListener('click', this.handlers.clear, false);
		
        this.renderJson(jsonContainer, this.props.files.json);
        this.renderSvg(svgContainer, this.props.files.svg);
        this.state.buttons[0].click();
    }

	static DefaultOptions() {
		return [{
				caption: 'All',
				emptyCaption: 'Nothing found'
			},{
				caption: 'Nodes',
				emptyCaption: 'Nothing found'
			},{
				caption: 'Output ports',
				emptyCaption: 'There are no ports for this model',
				filter: (item, value) => value.type === 'output'
			},{
				caption: 'Links',
				emptyCaption: 'Nothing found'
			}];
	}
}
