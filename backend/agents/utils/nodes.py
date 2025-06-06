from agents.utils.state import AgentState, llm, prompt
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import AnyMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import START, END

def get_input(state: "AgentState") -> str:
    msg = input("Input: ")
    return {"messages": [HumanMessage(msg)]}

def should_continue(state: "AgentState") -> str:
    if state['messages'][-1].content != "quit":
        return "action"
    else:
        return END

def tool_node(state: "AgentState") -> str:
    return

def call_model(state: "AgentState") -> str:
    history = state['messages'][:-1]
    message = prompt.invoke({'msg': state['messages'][-1].content, 'history': history})
    response = llm.invoke(message).content
    return {'messages': [AIMessage(content=response)]}

