import { Component, type ReactNode } from 'react'
export default class ErrorBoundary extends Component<{children:ReactNode},{err:boolean}>{
 state={err:false}; static getDerivedStateFromError(){return {err:true}}
 render(){return this.state.err?<div className="py-32 text-center"><h1 className="h-serif text-4xl">Something went wrong</h1><button className="btn btn-dark mt-6" onClick={()=>location.reload()}>Reload page</button></div>:this.props.children}}
