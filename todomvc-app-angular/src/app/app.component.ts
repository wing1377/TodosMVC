import { Component } from '@angular/core';

const todos = [
   {
     id: 1,
     title: '摄影',
     done: true
   },
   {
     id: 2,
    title: '设计',
     done: true
   },
   {
     id: 3,
     title: '程序',
     done: false
   }
 ]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]')

  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  } = null

  public visibility: string = "all"
  ngOnInit(){
    // Angular初始化时，监听hash的变化
    // 此处要用箭头函数
    this.hashchangeHandler();
    window.onhashchange = this.hashchangeHandler.bind(this)
  }
  // 当angular数据发生改变时，触发钩子函数
  // 在这个钩子函数里面持久化存储数据
  ngDoCheck(){
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }

// 实现导航切换数据过滤的功能
// 1、提供一个属性，该属性会根据当前点击的链接返回过滤之后的数据
//      filterTodos
// 2、提供一个属性，用来存储当前点击的链接标识
//      visibility 是一个字符串
//          all active completed
// 3、为链接添加点击事件，当点击导航链接的时候，改变
//      

  get filterTodos(){
    if(this.visibility === 'all'){
      return this.todos
    }else if(this.visibility === 'active'){
      return this.todos.filter(t => !t.done)
    }else if(this.visibility === 'completed'){
      return this.todos.filter(t => t.done)
    }
  }

  // 添加任务
  addTodo(e):void {
    const titleText = e.target.value;
    if(!titleText.length){
      return
    }
    const last = this.todos[this.todos.length-1]

    this.todos.push({
      // id: this.todos.length+ 1,
      id: last ? last.id + 1 : 1,
      title: titleText,
      done: false
    })
    e.target.value = ""
    // console.log(this.todos);
  }
  // 子开关控制总开关，全选总开关选中
  // 所有的t.done为真时，返回数据，存入checked
  get toggleAll(){
    return this.todos.every(t => t.done)
  }
  // 总开关控制子开关，全选全不选
  // 当总开关触发时`$event.target.checked`
  // 当input状态改变时，将checked的值传入函数，然后每项赋值
  set toggleAll(val){
    this.todos.forEach(t => t.done = val)
  }
  // 删除当前项
  removeTodo(index: number){
    this.todos.splice(index, 1)
  }

  saveEdit(e, todo){
    // 保存编辑
    todo.title = e.target.value;
    // 清除编辑样式
    this.currentEditing = null;
  }

  handleEditKeyup(e){
    const {keyCode, target} = e;
    if(keyCode == 27){
      // 取消编辑
      // 将文本框的值恢复到原来的值
      target.value = this.currentEditing.title;
      // 没有保存，显示层是label，编辑层是input，临时对象清空，就是回到显示层
      this.currentEditing = null;
    }
  }
  // 存入未完成的数据
  get remaningCount(){
    return this.todos.filter(t => !t.done).length
  }

  hashchangeHandler(){
    const hash = window.location.hash.substr(1)
    switch(hash){
      case '/':
        this.visibility = 'all'
        break
      case '/active':
        this.visibility = 'active'
        break
      case '/completed':
        this.visibility = 'completed'
        break
    }
  }

  // 清除所有已完成任务项
  clearCompleted(){
    this.todos = this.todos.filter(t => !t.done)
  }
}











