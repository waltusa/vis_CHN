USE [operator_log]
GO

/****** Object:  Table [dbo].[nonSkid]    Script Date: 10/20/2020 6:57:51 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[nonSkid](
	[name] [varchar](50) NULL,
	[styleCode] [varchar](50) NULL,
	[machineId] [varchar](50) NULL,
	[knitted] [date] NULL,
	[shift] [varchar](50) NULL,
	[toeHole] [varchar](50) NULL,
	[brokenNDL] [varchar](50) NULL,
	[missYarn] [varchar](50) NULL,
	[logoIssue] [varchar](50) NULL,
	[other] [varchar](50) NULL,
	[dirty] [varchar](50) NULL,
	[weights] [varchar](50) NULL,
	[dateRec] [datetime] NULL
) ON [PRIMARY]
GO

