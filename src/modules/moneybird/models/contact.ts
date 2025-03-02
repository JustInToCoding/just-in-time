import { Event } from './event';

export interface ContactPerson {
  id: string;
  contact_id: string;
  administration_id: number;
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
  email: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface Contact {
  id: string;
  administration_id: number;
  company_name: string;
  firstname: string | null;
  lastname: string | null;
  address1: string;
  address2: string;
  zipcode: string;
  city: string;
  country: string;
  phone: string;
  delivery_method: string;
  customer_id: string;
  tax_number: string;
  chamber_of_commerce: string;
  bank_account: string;
  is_trusted: boolean;
  max_transfer_amount: number | null;
  attention: string;
  email: string;
  email_ubl: boolean;
  send_invoices_to_attention: string;
  send_invoices_to_email: string;
  send_estimates_to_attention: string;
  send_estimates_to_email: string;
  sepa_active: boolean;
  sepa_iban: string;
  sepa_iban_account_name: string;
  sepa_bic: string;
  sepa_mandate_id: string;
  sepa_mandate_date: string | null;
  sepa_sequence_type: string;
  credit_card_number: string;
  credit_card_reference: string;
  credit_card_type: string | null;
  tax_number_validated_at: string | null;
  tax_number_valid: boolean | null;
  invoice_workflow_id: string | null;
  estimate_workflow_id: string | null;
  si_identifier: string;
  si_identifier_type: string | null;
  moneybird_payments_mandate: boolean;
  created_at: string;
  updated_at: string;
  version: number;
  sales_invoices_url: string;
  notes: any[];
  custom_fields: any[];
  contact_people: ContactPerson[];
  archived: boolean;
  events: Event[];
}
