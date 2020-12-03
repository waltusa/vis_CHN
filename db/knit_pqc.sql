USE [operator_log]
GO

/****** Object:  Table [dbo].[knit_pqc]    Script Date: 10/20/2020 6:57:06 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[knit_pqc](
	[Name] [nchar](10) NULL,
	[MachineId] [nchar](10) NULL,
	[Knitted] [date] NULL,
	[Shifit] [nchar](10) NULL,
	[toeHole] [nchar](10) NULL,
	[brokenNDL] [nchar](10) NULL,
	[missYarn] [nchar](10) NULL,
	[logoIssue] [nchar](10) NULL,
	[dirty] [nchar](10) NULL,
	[other] [nchar](10) NULL,
	[DateRec] [datetime] NULL
) ON [PRIMARY]
GO

