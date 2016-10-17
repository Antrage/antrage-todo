function get_todos() {
    var toDoList = new Array();
    var toDoList_str = localStorage.getItem('toDoList');

    if (toDoList_str !== null) {
        toDoList = JSON.parse(toDoList_str);
    }
    return toDoList;
}

function Task(name, desc, endTime, marker) {
    this.name = name;
    this.desc = desc;
    this.endTime = endTime;
    this.isChecked = false;
    this.marker = marker;
}



var taskNameEventDiv = document.getElementById('taskname');
var submitTaskDiv = document.getElementById('submit-task');
var newTaskDiv = document.getElementById('new-task');

taskNameEventDiv.onfocus = function() {
    submitTaskDiv.classList = 'field opened';
}



function resetValue() {
    document.getElementById('taskname').innerHTML = ''.replace(/^\s*/, '').replace(/\s*$/, '');

    setCaretToPos(document.getElementById('taskname'), 1);
    document.getElementById('taskname').focus();

    document.getElementById('taskdesc').innerHTML = '';
    document.getElementById('tasktime').value = '';
}

function setTask() {
    var taskName = decodeCharacterReferences(document.getElementById('taskname').innerHTML);
    taskName = taskName.replace(/<[^>]*>/g, "");

    var taskDesc = decodeCharacterReferences(document.getElementById('taskdesc').innerHTML);


    var taskTime = document.getElementById('tasktime').value;
    var markerPicker = document.getElementById("choosed-color").getAttribute('data-color');

    if (taskName !== '') {
        var taskItem = new Task(taskName, taskDesc, taskTime, markerPicker);
        var taskItem = JSON.stringify(taskItem);
        var toDoList = get_todos();
        toDoList.push(taskItem);
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
        document.getElementById('error-taskname').innerHTML = '';
        resetValue();

    } else {
        document.getElementById('error-taskname').innerHTML = 'Try to put another name';
        document.getElementById('error-taskname').classList.remove('fadeOut');
        document.getElementById('error-taskname').classList.add('animated', 'fadeIn');

        setTimeout(function() {
            document.getElementById('error-taskname').classList.remove('fadeIn');
            document.getElementById('error-taskname').classList.add('fadeOut');
            setTimeout(function() {
                document.getElementById('error-taskname').innerHTML = '';
            }, 500);
        }, 2000);
    }

    show();
}


function remove() {
    var id = parseInt(this.getAttribute('id').replace(/\D+/g, ""));
    var toDoList = get_todos();
    toDoList.splice(id, 1);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    this.parentNode.parentNode.className += (" bounceOutRight");
    setTimeout(show, 400);

    return false;
}

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}


function setToCheck() {
    var checkId = parseInt(this.getAttribute('id').replace(/\D+/g, ""));
    var toDoList = get_todos();

    var neededElement = JSON.parse(toDoList[checkId]);
    if (neededElement.isChecked) {
        neededElement.isChecked = false;
    } else {
        neededElement.isChecked = true;
    }

    neededElement = JSON.stringify(neededElement);
    toDoList.splice(checkId, 1, neededElement);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    show();

}


function show() {
    var toDoList = get_todos();
    var html = '<ul id="todolist-item">';

    for (prop in toDoList) {
        var a = JSON.parse(toDoList[prop]);

        if (a.isChecked) {
            var checkClass = 'checked';
        } else {
            var checkClass = '';
        }

        html += '<li class="animated ' + checkClass + '"><span class="marker" style="background:' + a.marker + '"></span><span class="task-name"><input type="checkbox" id="checking-id-' + Object.keys(toDoList).indexOf(prop) + '" class="checking" ' + checkClass + '/>' + a.name + '<span class="remove" id="element-' + Object.keys(toDoList).indexOf(prop) + '">Delete</span></span><span class="task-description">' + a.desc + '</span>' + '<span class="task-endtime">' + a.endTime + '</span></li>';
    }
    html += '</ul>';


    document.getElementById('todolist').innerHTML = html;

    var buttons = document.getElementsByClassName('remove');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };

    var checking = document.getElementsByClassName('checking');
    for (var i = 0; i < checking.length; i++) {
        checking[i].addEventListener('click', setToCheck);
    };

    for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', changeColor, false);
    }

    document.getElementById('choosed-color').addEventListener('click', pickColor);
    document.getElementById('more').addEventListener('click', openMore);
    document.getElementById('add').addEventListener('click', setTask);
    document.getElementById('clear-tasks').addEventListener('click', clearTasks);


    if(localStorage.getItem('toDoList') !== null){
        document.getElementById('clear-tasks').innerHTML = 'Remove all tasks';
    }else{
        document.getElementById('clear-tasks').innerHTML = '';
      
    }


}



function openMore() {

    var closed = document.getElementById('more-fields').classList;
    var closedText = document.getElementById('more');

    if (closed.contains('fadeOut')) {
        localStorage.setItem('openMore', 'fadeIn');
        
        document.getElementById('add').setAttribute('tabindex', '');

        closed.remove("fadeOut");
        closed.add("fadeIn");
        closedText.innerHTML = 'Hide properties';

    } else if (closed.contains('fadeIn')) {
        document.getElementById('add').setAttribute('tabindex', '2');

        localStorage.setItem('openMore', 'fadeOut');
        closed.remove("fadeIn");
        closed.add("fadeOut");
        closedText.innerHTML = 'Show properties';

    } else {
        localStorage.setItem('openMore', 'fadeIn');
        closed.add("fadeIn");
        closedText.innerHTML = 'Hide properties';

    }
}



var lS = localStorage.getItem('openMore');

document.getElementById('more-fields').classList += ' ' + lS;

if (localStorage.getItem('openMore') === 'fadeOut') {
    document.getElementById('more').innerHTML = 'Show properties';

    document.getElementById('taskname').setAttribute('tabindex', 1);
    document.getElementById('add').setAttribute('tabindex', 2);

  } else if (localStorage.getItem('openMore') === 'fadeIn') {
    document.getElementById('more').innerHTML = 'Hide properties';
    document.getElementById('submit-task').style.display = 'inline-block';

} else {
    document.getElementById('more').innerHTML = 'Show properties';
}



String.fromCharCodePoint = function() {
    var codeunits = [];
    for (var i = 0; i < arguments.length; i++) {
        var c = arguments[i];
        if (arguments[i] < 0x10000) {
            codeunits.push(arguments[i]);
        } else if (arguments[i] < 0x110000) {
            c -= 0x10000;
            codeunits.push((c >> 10 & 0x3FF) + 0xD800);
            codeunits.push((c & 0x3FF) + 0xDC00);
        }
    }
    return String.fromCharCode.apply(String, codeunits);
};

function decodeCharacterReferences(s) {
    return s.replace(/&#(\d+);/g, function(_, n) {;
        return String.fromCharCodePoint(parseInt(n, 10));
    }).replace(/&#x([0-9a-f]+);/gi, function(_, n) {
        return String.fromCharCodePoint(parseInt(n, 16));
    });
};



var decodeEntities = (function() {
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            str = str.replace(/&#([^\s]*);/g, function(x, y) {
                return String.fromCharCode(y)
            })
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();


var classname = document.getElementsByClassName('color-item');


function pickColor() {

    var colorList = document.getElementById('marker-picker-list').classList;

    if (colorList.contains("fadeOutUp")) {
        document.getElementById('marker-picker-list').style.display = 'block';
        document.getElementById('marker-picker-list').classList.remove('fadeOutUp');
        document.getElementById('marker-picker-list').classList.add('animated', 'fadeInDown');
    } else if (colorList.contains("fadeInDown")) {
        document.getElementById('marker-picker-list').classList.remove('animated', 'fadeInDown');
        document.getElementById('marker-picker-list').classList.add('animated', 'fadeOutUp');

        setTimeout(function() {
            document.getElementById('marker-picker-list').style.display = 'none';
        }, 500);

    } else {
        document.getElementById('marker-picker-list').style.display = 'block';
        document.getElementById('marker-picker-list').classList.add('animated', 'fadeInDown');

    }

    var elems = document.getElementById('marker-picker-list').childNodes;
    var elems = document.getElementsByClassName('color-item');

    // elems = Array.prototype.slice.call(elems); // теперь elems - массив

    for (var i = elems.length - 1; i >= 0; i--) {
        var a = elems[i].getAttribute('data-color');
        elems[i].style.background = a;
    }


}



var changeColor = function() {
    var attribute = this.getAttribute("data-color");
    document.getElementById('choosed-color').setAttribute('data-color', attribute);
    document.getElementById('choosed-color').style.background = attribute;

    document.getElementById('marker-picker-list').classList.remove('animated', 'fadeInDown');
    document.getElementById('marker-picker-list').classList.add('animated', 'fadeOutUp');

    setTimeout(function() {
        document.getElementById('marker-picker-list').style.display = 'none';
    }, 500);


};


function clearTasks (){
    localStorage.removeItem('toDoList');

    if(localStorage.getItem('toDoList') !== null){
        document.getElementById('clear-tasks').innerHTML = 'Remove all tasks';
    }else{
        document.getElementById('clear-tasks').innerHTML = '';

    }
    show();
}




window.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        setTask();
    }
}, true);




window.onscroll = function() {

  var scrolled = window.pageYOffset || document.documentElement.scrollTop;
  
  var obj = document.getElementById('todo-wrap');
  var obj2 = document.getElementById('todolist-item');
  var rect = obj.getBoundingClientRect().top;

  if(rect <= 30 && scrolled >= 60){
    obj.classList.add('fixed');
    obj2.classList.add('padding-top');
  }else{
    obj.classList.remove('fixed');
    obj2.classList.add('padding-top');

  }

}

show();
