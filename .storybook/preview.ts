import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    a11y: {
      // Violations fail the test run. Nothing is set to 'todo' or 'off'.
      test: 'error',
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Tokens', 'Contrast', 'Focus and keyboard'],
          'Components',
          'Patterns',
        ],
      },
    },
  },
};

export default preview;
