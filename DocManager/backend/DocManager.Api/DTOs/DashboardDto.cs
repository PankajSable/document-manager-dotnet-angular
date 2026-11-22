namespace DocManager.Api.DTOs;

public record DashboardDto(int TotalDocuments, int TotalClients, int Expired, int ExpiringIn30, List<DocumentDto> Due);
