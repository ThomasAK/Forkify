import View from "./view";
import PreviewView from "./previewView";
import previewView from "./previewView";

class BookMarksView extends View{
    _parentElement = document.querySelector('.bookmarks__list')
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
    _message = ''

    addHandlerRender(handler){
        window.addEventListener('load', handler())
    }

    _generateMarkup(){
        return this._data
            .map(result => previewView.render(result, false))
            .join('')
    }


}

export default new BookMarksView();