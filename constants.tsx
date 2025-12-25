
import { Criterion, VisaType, PricingPlan } from './types';

export const EB1A_CRITERIA: Criterion[] = [
  { id: 'awards', title: 'Lesser National/Intl Awards', description: 'Documentation of nationally or internationally recognized prizes or awards for excellence in the field.', category: 'EB1A' },
  { id: 'membership', title: 'Distinguished Memberships', description: 'Membership in associations which require outstanding achievements of their members, as judged by recognized national or international experts.', category: 'EB1A' },
  { id: 'published_material', title: 'Major Media Coverage', description: 'Published material in professional or major trade publications or other major media about you and your work.', category: 'EB1A' },
  { id: 'judging', title: 'Peer Review & Judging', description: 'Evidence that you have participated as a judge of the work of others in the same or an allied field.', category: 'EB1A' },
  { id: 'contributions', title: 'Original Contributions', description: 'Evidence of your original scientific, scholarly, artistic, athletic, or business-related contributions of major significance.', category: 'EB1A' },
  { id: 'authorship', title: 'Scholarly Authorship', description: 'Authorship of scholarly articles in professional or major trade publications or other major media.', category: 'EB1A' },
  { id: 'display', title: 'Artistic Exhibitions', description: 'Evidence of the display of your work in the field at artistic exhibitions or showcases.', category: 'EB1A' },
  { id: 'leading_role', title: 'Leading or Critical Role', description: 'Performance of a leading or critical role in organizations or establishments that have a distinguished reputation.', category: 'EB1A' },
  { id: 'salary', title: 'High Remuneration', description: 'Evidence that you command a high salary or other significantly high remuneration in relation to others in the field.', category: 'EB1A' },
  { id: 'commercial_success', title: 'Commercial Success', description: 'Evidence of commercial successes in the performing arts, as shown by box office receipts or record sales.', category: 'EB1A' }
];

export const O1_CRITERIA: Criterion[] = [
  { id: 'o1_awards', title: 'Excellence Awards', description: 'Receipt of nationally or internationally recognized prizes or awards for excellence in the field of endeavor.', category: 'O1' },
  { id: 'o1_membership', title: 'Professional Associations', description: 'Membership in associations in the field which require outstanding achievements of their members.', category: 'O1' },
  { id: 'o1_media', title: 'Media Recognition', description: 'Published material in professional or major trade publications or other major media regarding you and your work.', category: 'O1' },
  { id: 'o1_judging', title: 'Judging & Evaluation', description: 'Participation on a panel, or individually, as a judge of the work of others in the same field.', category: 'O1' },
  { id: 'o1_contributions', title: 'Significant Contributions', description: 'Scientific, scholarly, or business-related contributions of major significance in the field.', category: 'O1' },
  { id: 'o1_authorship', title: 'Scholarly Publication', description: 'Authorship of scholarly articles in the field in professional journals or other major media.', category: 'O1' },
  { id: 'o1_employment', title: 'Essential Capacity', description: 'Employment in a critical or essential capacity for organizations that have a distinguished reputation.', category: 'O1' },
  { id: 'o1_salary', title: 'Superior Remuneration', description: 'Evidence that you have either commanded, or will command, a high salary or other remuneration for services.', category: 'O1' }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'The Preliminary Inquiry',
    price: 0,
    period: 'free',
    features: ['Curated Eligibility Brief', 'Automated Merit Summary', 'Essential Criteria Overview'],
  },
  {
    id: 'monthly',
    name: 'The Sovereign Monthly',
    price: 99,
    period: 'month',
    features: ['Comprehensive Jurisprudential Audit', 'Strategic Advancement Roadmap', 'Vulnerability Assessment', 'Standardized Petition Templates', 'Concierge Priority Assistance'],
  },
  {
    id: 'quarterly',
    name: 'The Consular Quarterly',
    price: 199,
    period: 'quarter',
    isPopular: true,
    features: ['Full Suite Merit Audit', 'Preemptive RFE Simulation', 'Documentation Integrity Review', 'Priority Neural Model Access', 'Three Detailed Strategic Dossiers'],
  },
  {
    id: 'yearly',
    name: 'The Plenipotentiary Annual',
    price: 599,
    period: 'year',
    features: ['Comprehensive Global Strategy', 'Bespoke Evidence Compendium', 'Unlimited Neural Iterations', 'Elite Counsel Referral Program', 'Perpetual Archive Access'],
  }
];
