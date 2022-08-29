import { ERROR } from "../constants/error-template.constant.js";
import { ROUTES } from "../constants/routes.constant.js";

export class Router {

    init(){
        window.addEventListener('popstate', (event) => {
            this.render(window.location.pathname);
        });

        this.navigate(window.location.pathname);
    }

    navigate(path, data = {}){
        window.history.pushState(
            {
                ...data,
                prevPath: window.location.pathname
            },
            path,
            window.location.origin + path
        );

        this.render(path);
    }

    async render(path){
        const route = ROUTES[path];
        this.toggleActiveClasses(route,path);

        let template;
        if(route.templateUrl){
            template = await this.fetchTemplate(route.templateUrl);
        } else {
            template = ERROR.PAGE_NOT_FOUND;
        }
 
        const fragment = document.createRange().createContextualFragment(template);

        const root = document.getElementById('router-outlet');
        root.innerHTML = "";
        root.appendChild(fragment);
    }

    async fetchTemplate(templateUrl){
        return new Promise((resolve,reject)=>{
            try{
                const xhttp = new XMLHttpRequest();
                xhttp.onload = function() {
                    if(this.status === 200){
                        resolve(this.responseText);
                    } else {
                        resolve(ERROR.SOMETHING_WENT_WRONG);
                    }
                }
                xhttp.open("GET", templateUrl);
                xhttp.send();
            }catch(e){
                console.error(e);
                resolve(ERROR.SOMETHING_WENT_WRONG);
            }
        })
    }

    toggleActiveClasses(route,path){
        let prevPath = window.history.state ? window.history.state.prevPath : null;
        if(prevPath === path){
            prevPath = null;
        }
        if(route.activeClass){
            const currRoute = document.querySelector(`[data-path="${path}"]`);
            const prevRoute = document.querySelector(`[data-path="${prevPath}"]`);

            currRoute ? currRoute.classList.add(route.activeClass) : null;
            prevRoute ? prevRoute.classList.remove(route.activeClass) : null;
        }
    }

}