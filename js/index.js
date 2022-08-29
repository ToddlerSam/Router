import { Router } from "./router.js"

(function(){

        const router = new Router;

        router.init();
        document.addEventListener('click',(event)=>{
            const {
                target: {
                    id = ""
                }
            } = event;

            let path = null;
            if(event.target.attributes && event.target.attributes['data-path']){
                path = event.target.attributes['data-path'].value;
            }

            if(path){
                switch(id){
                    case "route":
                        router.navigate(path);
                    break;    
                }
            }

            
        })
    
})()