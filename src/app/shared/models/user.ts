import { OrganizationList } from './organization-list';

export interface User{
    UserName: string;
    UserId: number;
    IsAdmin: boolean;
    HasCard: boolean;
    UserAccountId: number;
    AccountTypeId: number;
    CardId: number;
    Token: string;
    StartPage: string;
    Index: number;
    Organizations: OrganizationList[];
    DisplayName: string;
    OnboardingComplete: boolean;
    ActivationToken: string;
}