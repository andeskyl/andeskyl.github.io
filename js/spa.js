class Layout{
    constructor(...pages){
        this.pages = pages;
    }

    load(){
        return Promise.all(this.pages.map((page) => page.load()));
    }

    show(el){
        for (let page of this.pages){
            const div = document.createElement('div');
            page.show(div);
            el.appendChild(div);
        }
    }
}

class Page{
    constructor(url){
        this.url = 'pages/' + url;
    }

    async load(){
        try {
            const response = await fetch(this.url);
            if (response.ok){
                const contentType = response.headers.get('Content-Type') || '';
                if (contentType.includes('text/html')) {
                    return response
                        .text()
                        .then((res) =>{
                            return (this.html = res);
                        })
                        .catch((error) =>{
                            return Promise.reject(
                                new ResponseError('HTML error: ' + error.message)
                            );
                        });
                }
                return Promise.reject(new ResponseError('Invalid content type: ' + contentType));
            }
            if (response.status == 404) {
                return Promise.reject(new NotFoundError('Page not found: ' + this.url));
            }
            return Promise.reject(new HttpError('HTTP error: ' + response.status));
        } catch (error2) {
            return Promise.reject(new NetworkError(error2.message));
        }
    }

    show(el){
        el.innerHTML = this.html;
    }
}

class Router{
    constructor(routes, el){
        this.routes = routes;
        this.el = el;
        window.onhashchange = this.hashChanged.bind(this);
        this.hashChanged();
    }

    async hashChanged(e){
        if (window.location.hash.length > 0) {
            const pageName = window.location.hash.substr(1);
            this.show(pageName);
        } else if (this.routes["#default"]) {
            this.show("#default");
        }
    }

    async show(pageName){
        const page = this.routes[pageName];
        await page.load();
        this.el.innerHTML = "";
        page.show(this.el);
        pageInit();
    }
}

const router = new Router(
    {
        about: new Layout(new Page("about.html")),
        research: new Layout(new Page("research.html")),
        project: new Layout(new Page("project.html")),
        hobby: new Layout(new Page("hobby.html")),
        "#default": new Page("about.html"),
    },
    document.querySelector("main")
);
