"use client";

import clsx from "clsx";

import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Transition } from "@headlessui/react";
import {
  SparklesIcon,
  CodeBracketIcon,
  FilmIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MinusIcon,
} from "@heroicons/react/20/solid";

const EventsTab: React.FC = () => {
  return <div>Events</div>;
};

enum ObjectTab {
  Events = "Events",
  Sprites = "Sprites",
  Physics = "Physics",
  VariableDefinitions = "Variable Definitions",
}

interface ObjectTabInfo {
  name: string;
  icon: any;
  tab: ObjectTab;
  component?: React.FC;
}

const OBJECT_TABS: ObjectTabInfo[] = [
  {
    name: "Events",
    icon: CodeBracketIcon,
    tab: ObjectTab.Events,
    component: EventsTab,
  },
  { name: "Sprites", icon: FilmIcon, tab: ObjectTab.Sprites },
  { name: "Physics", icon: BoltIcon, tab: ObjectTab.Physics },
  {
    name: "Variable Definitions",
    icon: AdjustmentsHorizontalIcon,
    tab: ObjectTab.VariableDefinitions,
  },
];

const ObjectNode: React.FC<{ data: { label?: string } }> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedTab, setExpandedTab] = useState<ObjectTabInfo | null>(null);

  useEffect(() => {
    // Whenever the tab is expanded, we want to close it when the node is collapsed
    if (!expanded) {
      setExpandedTab(null);
    }
  });

  return (
    <span className="flex flex-row p-1">
      <div
        className={clsx(
          "bg-white ring-1 ring-gray-300 min-h-fit pt-2 rounded-md w-52 overflow-hidden transition-all duration-150 shadow-xl shadow-sky-100",
          !expanded && "hover:bg-gray-100"
        )}
        style={{ height: expanded ? "16.6rem" : "4rem" }}
        onClick={() => {
          if (!expanded) {
            // We must check this condition so we don't close the node and then expand it again
            setExpanded(true);
          }
        }}>
        <span className="flex flex-row gap-2 px-2 mb-2">
          <img
            src="/player.png"
            className="h-12 w-12 rounded-md outline-none object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-sm text-gray-900 font-semibold">
              {data.label}
            </h3>
            <p className="text-xs text-gray-500">Object</p>
          </div>
          {expanded && (
            <span className="flex flex-row ml-auto h-full">
              <MinusIcon
                className="w-6 p-1 text-gray-400 hover:bg-gray-100 rounded-md hover:text-gray-500"
                onClick={() => setExpanded(false)}
              />
              <XMarkIcon className="w-6 p-1 text-gray-400 hover:bg-gray-100 rounded-md hover:text-gray-500" />
            </span>
          )}
        </span>
        <Transition
          as={React.Fragment}
          show={expanded}
          appear={true}
          enter="transition-all duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="flex flex-col text-sm ">
            <div className="h-[1px] w-full my-1 bg-gray-200" />
            <span className="flex mx-1 group flex-row rounded-md font-medium items-center h-fit py-2 hover:text-indigo-900 text-indigo-700 hover:bg-indigo-50 transition-all duration-100">
              <SparklesIcon
                className="mr-3 w-5 text-indigo-400 ml-2 group-hover:text-indigo-500 transition-all duration-100"
                aria-hidden="true"
              />
              Edit with AI
            </span>
            <div className="h-[1px] w-full my-1 bg-gray-200" />
            {OBJECT_TABS.map((tab) => (
              <span
                key={tab.name}
                onClick={() => setExpandedTab(tab)}
                className={clsx(
                  "flex group flex-row items-center mx-1 h-fit font-medium rounded-md py-2 hover:text-gray-900 text-gray-700 hover:bg-gray-100 transition-all duration-100",
                  expandedTab === tab && "bg-gray-100 text-gray-900"
                )}>
                <tab.icon
                  className={clsx(
                    "mr-3 w-5 text-gray-400 ml-2 group-hover:text-gray-500 transition-all duration-100",
                    expandedTab === tab &&
                      "text-gray-700 group-hover:text-gray-700"
                  )}
                  aria-hidden="true"
                />
                {tab.name}
              </span>
            ))}
          </div>
        </Transition>
      </div>
      <Transition
        as="div"
        show={expandedTab !== null && expandedTab.component !== undefined}
        appear={true}
        enter="transition-all duration-150"
        enterFrom="opacity-0 -translate-x-16 scale-95"
        enterTo="opacity-100 translate-x-0 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 translate-x-0 scale-100"
        leaveTo="opacity-0 -translate-x-16 scale-95"
        className="flex flex-row">
        <div className="w-4 mx-[1px] backdrop-blur-sm " />
        <div className="w-52 h-52 bg-white ring-1 ring-gray-300 rounded-md shadow-xl shadow-sky-100">
          {expandedTab?.component && <expandedTab.component />}
        </div>
      </Transition>
    </span>
  );
};

const NODE_TYPES = { objectNode: ObjectNode };

const initialNodes = [
  {
    id: "Player",
    position: { x: 0, y: 0 },
    type: "objectNode",
    data: { label: "Player" },
  },
];

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="bg-white">
      <ReactFlow
        nodes={nodes}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        autoPanOnNodeDrag
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}>
        <Background className="-z-50" />
      </ReactFlow>
    </div>
  );
}
