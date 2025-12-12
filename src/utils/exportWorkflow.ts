import type { Workflow } from '../types';

export const exportWorkflowAsJSON = (workflow: Workflow): void => {
  try {
    // Create the export data in the required format
    const exportData = {
      name: workflow.name,
      nodes: workflow.nodes || [],
      edges: workflow.edges || []
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create a blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export workflow as JSON:', error);
  }
};
