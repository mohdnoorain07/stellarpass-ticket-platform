import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventForm, type EventFormData } from '../EventForm';

const baseForm: EventFormData = {
  title: 'Test Event',
  organizer: 'Test Organizer',
  price: '100',
  totalSupply: '200',
  createOnChain: false,
  creatorShareBps: '8000',
  platformShareBps: '2000',
};

function renderEventForm(overrides?: Partial<EventFormData>) {
  const form = { ...baseForm, ...overrides };
  const onChange = vi.fn();
  const onSubmit = vi.fn((e) => e.preventDefault());
  const utils = render(
    <EventForm
      form={form}
      onChange={onChange}
      isSubmitting={false}
      onSubmit={onSubmit}
    />
  );
  return { ...utils, onChange, onSubmit, form };
}

describe('EventForm', () => {
  it('renders the form header', () => {
    renderEventForm();
    expect(screen.getByText('Host New Event')).toBeInTheDocument();
    expect(screen.getByText(/Create a local draft or publish on-chain/)).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    renderEventForm();

    expect(screen.getByPlaceholderText('Midnight Jazz Club')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apex Promotions')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
  });

  it('shows on-chain fields when createOnChain is checked', () => {
    renderEventForm({ createOnChain: true });

    expect(screen.getByDisplayValue('8000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
    expect(screen.getByText(/10,000 bps = 100%/)).toBeInTheDocument();
  });

  it('hides on-chain fields when createOnChain is unchecked', () => {
    renderEventForm({ createOnChain: false });

    expect(screen.queryByDisplayValue('8000')).not.toBeInTheDocument();
  });

  it('calls onChange when title input changes', () => {
    const { onChange } = renderEventForm();
    const input = screen.getByPlaceholderText('Midnight Jazz Club');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(onChange).toHaveBeenCalledWith('title', 'New Title');
  });

  it('calls onChange when organizer input changes', () => {
    const { onChange } = renderEventForm();
    const input = screen.getByPlaceholderText('Apex Promotions');
    fireEvent.change(input, { target: { value: 'New Organizer' } });
    expect(onChange).toHaveBeenCalledWith('organizer', 'New Organizer');
  });

  it('calls onChange when price input changes', () => {
    const { onChange } = renderEventForm();
    const input = screen.getByDisplayValue('100');
    fireEvent.change(input, { target: { value: '250' } });
    expect(onChange).toHaveBeenCalledWith('price', '250');
  });

  it('calls onChange when totalSupply input changes', () => {
    const { onChange } = renderEventForm();
    const input = screen.getByDisplayValue('200');
    fireEvent.change(input, { target: { value: '500' } });
    expect(onChange).toHaveBeenCalledWith('totalSupply', '500');
  });

  it('calls onChange when on-chain checkbox is toggled', () => {
    const { onChange } = renderEventForm({ createOnChain: false });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith('createOnChain', true);
  });

  it('calls onChange on royalty fields when on-chain is enabled', () => {
    const { onChange } = renderEventForm({ createOnChain: true });
    const creatorInput = screen.getByDisplayValue('8000');
    fireEvent.change(creatorInput, { target: { value: '7500' } });
    expect(onChange).toHaveBeenCalledWith('creatorShareBps', '7500');
  });

  it('submits the form on button click', () => {
    const { onSubmit } = renderEventForm();
    const submitButton = screen.getByText('Create Local Draft');
    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows "Publish Event" button text when on-chain is enabled', () => {
    renderEventForm({ createOnChain: true });
    expect(screen.getByText('Publish Event')).toBeInTheDocument();
  });

  it('shows "Create Local Draft" button text when on-chain is disabled', () => {
    renderEventForm({ createOnChain: false });
    expect(screen.getByText('Create Local Draft')).toBeInTheDocument();
  });

  it('shows "Publishing..." button text when on-chain and submitting', () => {
    const form = { ...baseForm, createOnChain: true };
    render(
      <EventForm
        form={form}
        onChange={vi.fn()}
        isSubmitting={true}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByText('Publishing...')).toBeInTheDocument();
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(
      <EventForm
        form={baseForm}
        onChange={vi.fn()}
        isSubmitting={true}
        onSubmit={vi.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders price and total supply side by side in a grid', () => {
    renderEventForm();
    expect(screen.getByText('Price (XLM)')).toBeInTheDocument();
    expect(screen.getByText('Total Supply')).toBeInTheDocument();
  });

  it('renders on-chain info text when checkbox is enabled', () => {
    renderEventForm({ createOnChain: true });
    expect(screen.getByText(/Requires Freighter signature/)).toBeInTheDocument();
  });
});
