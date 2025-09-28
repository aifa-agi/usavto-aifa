// TableToolbarGroup.tsx
"use client";

import * as React from "react";
import { EditorContext } from "@tiptap/react";
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button";
import { ToolbarGroup } from "@/components/tiptap/tiptap-ui-primitive/toolbar";

interface TableToolbarGroupProps {
    isExpanded: boolean;
    onToggle: () => void;
}

export const TableToolbarGroup: React.FC<TableToolbarGroupProps> = ({
    isExpanded,
    onToggle
}) => {
    const { editor } = React.useContext(EditorContext);

    if (!editor) return null;

    const tableButtons = [
        {
            label: "Insert table",
            action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            canExecute: () => editor.can().insertTable(),
        },
        {
            label: "Add column before",
            action: () => editor.chain().focus().addColumnBefore().run(),
            canExecute: () => editor.can().addColumnBefore(),
        },
        {
            label: "Add column after",
            action: () => editor.chain().focus().addColumnAfter().run(),
            canExecute: () => editor.can().addColumnAfter(),
        },
        {
            label: "Delete column",
            action: () => editor.chain().focus().deleteColumn().run(),
            canExecute: () => editor.can().deleteColumn(),
        },
        {
            label: "Add row before",
            action: () => editor.chain().focus().addRowBefore().run(),
            canExecute: () => editor.can().addRowBefore(),
        },
        {
            label: "Add row after",
            action: () => editor.chain().focus().addRowAfter().run(),
            canExecute: () => editor.can().addRowAfter(),
        },
        {
            label: "Delete row",
            action: () => editor.chain().focus().deleteRow().run(),
            canExecute: () => editor.can().deleteRow(),
        },
        {
            label: "Delete table",
            action: () => editor.chain().focus().deleteTable().run(),
            canExecute: () => editor.can().deleteTable(),
        },
        {
            label: "Merge cells",
            action: () => editor.chain().focus().mergeCells().run(),
            canExecute: () => editor.can().mergeCells(),
        },
        {
            label: "Split cell",
            action: () => editor.chain().focus().splitCell().run(),
            canExecute: () => editor.can().splitCell(),
        },
        {
            label: "Toggle header column",
            action: () => editor.chain().focus().toggleHeaderColumn().run(),
            canExecute: () => editor.can().toggleHeaderColumn(),
        },
        {
            label: "Toggle header row",
            action: () => editor.chain().focus().toggleHeaderRow().run(),
            canExecute: () => editor.can().toggleHeaderRow(),
        },
        {
            label: "Toggle header cell",
            action: () => editor.chain().focus().toggleHeaderCell().run(),
            canExecute: () => editor.can().toggleHeaderCell(),
        },
        {
            label: "Merge or split",
            action: () => editor.chain().focus().mergeOrSplit().run(),
            canExecute: () => editor.can().mergeOrSplit(),
        },
        {
            label: "Set cell attribute",
            action: () => editor.chain().focus().setCellAttribute('backgroundColor', '#f0f0f0').run(),
            canExecute: () => editor.can().setCellAttribute('backgroundColor', '#f0f0f0'),
        },
        {
            label: "Fix tables",
            action: () => editor.chain().focus().fixTables().run(),
            canExecute: () => editor.can().fixTables(),
        },
        {
            label: "Go to next cell",
            action: () => editor.chain().focus().goToNextCell().run(),
            canExecute: () => editor.can().goToNextCell(),
        },
        {
            label: "Go to previous cell",
            action: () => editor.chain().focus().goToPreviousCell().run(),
            canExecute: () => editor.can().goToPreviousCell(),
        },
    ];

    return (
        <>
            {/* Основная кнопка Table */}
            <ToolbarGroup>
                <Button
                    data-style="ghost"
                    onClick={onToggle}
                    title="Table Tools"
                    className={isExpanded ? "bg-accent text-accent-foreground" : ""}
                >
                    Table
                </Button>
            </ToolbarGroup>

            {/* Контейнер с горизонтальной прокруткой для 18 кнопок */}
            {isExpanded && (
                <div
                    className="flex overflow-x-auto overflow-y-hidden w-full py-2 custom-scrollbar"

                >
                    <ToolbarGroup className="flex-nowrap min-w-max">
                        {tableButtons.map((button, index) => (
                            <Button
                                key={index}
                                data-style="outline"
                                onClick={() => {
                                    button.action();
                                    if (button.label === "Insert table") {
                                        onToggle(); // Закрываем после вставки
                                    }
                                }}
                                disabled={!button.canExecute()}
                                title={button.label}
                                className={`
                  animate-in slide-in-from-left-2 duration-150 
                  text-xs whitespace-nowrap px-3 py-1.5
                  border border-border rounded-md
                  hover:bg-accent hover:text-accent-foreground
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex-shrink-0
                `}
                                style={{
                                    animationDelay: `${index * 15}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </ToolbarGroup>
                </div>
            )}
        </>
    );
};
