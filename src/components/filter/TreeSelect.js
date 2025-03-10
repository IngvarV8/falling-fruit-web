import React, { useCallback, useState } from 'react'

import TreeSelectView from './TreeSelectView'

const TreeSelect = ({ types, onChange, selectTree }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const handleToggle = (nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const handleCheckboxChange = useCallback(
    (node) => {
      const newTypes = new Set(types)

      const updateNodeAndDescendants = (currentNode, shouldSelect) => {
        if (currentNode.value) {
          if (shouldSelect) {
            newTypes.add(currentNode.value)
          } else {
            newTypes.delete(currentNode.value)
          }
        }

        currentNode.children.forEach((child) =>
          updateNodeAndDescendants(child, shouldSelect),
        )
      }

      const updateAncestors = (currentNode) => {
        if (currentNode.parent) {
          const allChildrenSelected = currentNode.parent.children.every(
            (child) =>
              child.value
                ? newTypes.has(child.value)
                : child.children.every((grandChild) =>
                    newTypes.has(grandChild.value),
                  ),
          )
          if (currentNode.parent.value) {
            if (allChildrenSelected) {
              newTypes.add(currentNode.parent.value)
            } else {
              newTypes.delete(currentNode.parent.value)
            }
          }
          updateAncestors(currentNode.parent)
        }
      }

      const isSelected = node.isSelected
      updateNodeAndDescendants(node, !isSelected)
      updateAncestors(node)

      onChange(Array.from(newTypes))
    },
    [types, onChange],
  )

  return (
    <TreeSelectView
      renderTree={selectTree}
      expandedNodes={expandedNodes}
      handleToggle={handleToggle}
      handleCheckboxChange={handleCheckboxChange}
    />
  )
}

export default TreeSelect
