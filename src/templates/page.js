import AuthCheck from '../components/AuthCheck';
import Page from '../components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import {Provider as ApiDocContextProvider} from '../components/ApiDoc/index.js';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {graphql} from 'gatsby';
import {useConfig} from '../utils/config';

export default function PageTemplate({data, location}) {
  const config = useConfig(data.file.basePath);
  const page = <ApiDocContextProvider value={data.apiDoc}><Page file={data.file} uri={location.pathname} /></ApiDocContextProvider>;

  if (!config.internal) {
    return page;
  }

  return (
    <>
      <GatsbySeo noindex />
      <AuthCheck>{page}</AuthCheck>
    </>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!, $api_doc: [String!]!) {
    file(id: {eq: $id}) {
      name
      basePath: sourceInstanceName
      relativePath
      gitRemote {
        full_name
        ref
      }
      childMdx {
        body
        headings {
          depth
          value
        }
        frontmatter {
          title
          subtitle
          description
          toc
          tags
          headingDepth
          minVersion
          noIndex
        }
      }
      childMarkdownRemark {
        html
        headings {
          depth
          value
        }
        frontmatter {
          title
          subtitle
          description
          headingDepth
          minVersion
          noIndex
        }
      }
    }
    apiDoc(canonicalReference: $api_doc) {
      ...Base
      ...Interface
      ...TypeAlias
      ...Property
      ...Function
      ...Class
      ...Constructor
      ...Property
      ...Method
      ...PropertySignature
      ...MethodSignature
      ... on ApiDocBase {
        references {
          text
          canonicalReference
        }
      }
    }
  }


fragment Ref on ApiDocBase {
  canonicalReference
}

fragment Base on ApiDocBase {
  id
  canonicalReference
  displayName
  file
  excerpt
  kind
  releaseTag
  comment {
    summary
    deprecated
    remarks
    examples
  }
}

fragment Interface on ApiDocInterface {
  typeParameters {
    name
    optional
    comment
  }
  childrenIncomplete
  properties {
    ...Ref
  }
}

fragment TypeAlias on ApiDocTypeAlias {
  typeParameters {
    name
    optional
    comment
  }
  type
}

fragment PropertySignature on ApiDocPropertySignature {
  optional
  readonly
  type
}

fragment MethodSignature on ApiDocMethodSignature {
  optional
  returnType
  parameters {
    ...FunctionParameter
  }
}

fragment Function on ApiDocFunction {
  returnType
  parameters {
    ...FunctionParameter
  }
}

fragment Class on ApiDocClass {
  implements
  constructorMethod {
    ...Ref
  }
  childrenIncomplete
  properties {
    ...Ref
  }
  methods {
    ...Ref
  }
}

fragment Property on ApiDocProperty {
  abstract
  optional
  static
  readonly
}

fragment Method on ApiDocMethod {
  abstract
  optional
  static
  returnType
  parameters {
    ...FunctionParameter
  }
}

fragment Constructor on ApiDocConstructor {
  parameters {
    ...FunctionParameter
  }
}

fragment FunctionParameter on ApiDocFunctionParameter {
  name
  type
  optional
  comment
}
`;
