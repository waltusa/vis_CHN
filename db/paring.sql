USE [paring]
GO

/****** Object:  Table [dbo].[paringQC]    Script Date: 10/20/2020 6:58:12 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[paringQC](
	[Name] [varchar](50) NULL,
	[KnittedTime] [date] NULL,
	[MachineId] [varchar](50) NULL,
	[DateRec] [datetime] NULL,
	[itemNum] [varchar](50) NULL,
	[toeHole] [varchar](50) NULL,
	[brokenNeedle] [varchar](50) NULL,
	[missingYarn] [varchar](50) NULL,
	[logoIssue] [varchar](50) NULL,
	[dirty] [varchar](50) NULL,
	[other] [varchar](50) NULL,
	[products] [varchar](50) NULL,
	[shift] [varchar](55) NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_Name]  DEFAULT ((0)) FOR [Name]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_toeHole]  DEFAULT ((0)) FOR [toeHole]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_brokenNeddle]  DEFAULT ((0)) FOR [brokenNeedle]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_missingYarn]  DEFAULT ((0)) FOR [missingYarn]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_logoIssue]  DEFAULT ((0)) FOR [logoIssue]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_dirty]  DEFAULT ((0)) FOR [dirty]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [DF_paringQC_other]  DEFAULT ((0)) FOR [other]
GO

ALTER TABLE [dbo].[paringQC] ADD  CONSTRAINT [df_productd]  DEFAULT ((0)) FOR [products]
GO

