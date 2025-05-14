from agents.agent import graph

for event in graph.stream({"messages": []}, stream_mode='values'):
    if len(event["messages"]) > 0:
        event["messages"][-1].pretty_print()