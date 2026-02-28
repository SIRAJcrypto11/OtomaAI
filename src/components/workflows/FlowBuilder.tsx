"use client";

import React, { useState, useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
    {
        id: 'trigger-1',
        type: 'input',
        data: { label: 'Telegram Webhook' },
        position: { x: 250, y: 5 },
        style: {
            background: '#202124',
            color: 'white',
            border: '1px solid #DADCE0',
            borderRadius: '8px',
            padding: '10px'
        }
    },
    {
        id: 'agent-1',
        data: { label: '🧠 Agent: Customer Service' },
        position: { x: 250, y: 150 },
        style: {
            background: '#1A73E8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '15px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
    },
    {
        id: 'action-1',
        type: 'output',
        data: { label: 'Save to Memory' },
        position: { x: 100, y: 300 },
        style: {
            background: '#1E8E3E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px'
        }
    },
    {
        id: 'action-2',
        type: 'output',
        data: { label: 'Telegram Reply' },
        position: { x: 400, y: 300 },
        style: {
            background: '#202124',
            color: 'white',
            border: '1px solid #DADCE0',
            borderRadius: '8px',
            padding: '10px'
        }
    }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'trigger-1', target: 'agent-1', animated: true, style: { stroke: '#1A73E8', strokeWidth: 2 } },
    { id: 'e2-3', source: 'agent-1', target: 'action-1', type: 'smoothstep' },
    { id: 'e2-4', source: 'agent-1', target: 'action-2', type: 'smoothstep' },
];

export default function FlowBuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#1A73E8', strokeWidth: 2 } }, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 150px)', border: '1px solid #DADCE0', borderRadius: '12px', background: '#F8F9FA' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
                <Background color="#ccc" variant={BackgroundVariant.Dots} gap={20} size={1} />
            </ReactFlow>
        </div>
    );
}
